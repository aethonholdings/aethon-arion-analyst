// Smoke test: serves the built app (npm run build -- --configuration development) and drives it in Chromium
// against a stubbed API. Run with: npm run test:smoke
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const dist = path.resolve(__dirname, "..", "dist", "arion", "analyst");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ico": "image/x-icon", ".svg": "image/svg+xml" };
const envelope = (payload) => JSON.stringify({ requestId: "smoke", responseTimeMs: 1, success: true, payload });
const simSets = [{ id: 1, description: "Smoke test set", modelName: "C1", optimiserName: "C1GradientAscentOptimiser", configuratorName: "C1BaseConfigurator", state: "running" }];

function serve() {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            let file = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
            if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, "index.html"); // SPA fallback
            res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
            fs.createReadStream(file).pipe(res);
        });
        server.listen(0, "127.0.0.1", () => resolve(server));
    });
}

async function main() {
    if (!fs.existsSync(path.join(dist, "index.html"))) throw new Error(`build the app first: ${dist} not found`);
    const server = await serve();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const failures = [];
    try {
        const page = await browser.newPage();
        page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
        const apiCalls = [];
        await page.route("http://localhost:3000/arion/**", (route) => {
            const url = new URL(route.request().url());
            apiCalls.push(`${route.request().method()} ${url.pathname}`);
            if (url.pathname === "/arion/sim-set") return route.fulfill({ status: 200, contentType: "application/json", body: envelope(simSets) });
            return route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ success: false, error: { status: 404, message: "Not Found" } }) });
        });

        await page.goto(base + "/");
        await page.waitForURL(/\/sim-set$/, { timeout: 15000 });
        await page.getByText("Smoke test set").waitFor({ timeout: 15000 });
        if (!apiCalls.includes("GET /arion/sim-set")) failures.push("the SimSet index did not request GET /arion/sim-set");

        await page.goto(base + "/sim-set/create");
        await page.getByText("Create New SimSet").first().waitFor({ timeout: 15000 });
        await page.getByText("Parameter Space").first().waitFor({ timeout: 15000 });
    } catch (error) {
        failures.push(error.message);
    } finally {
        await browser.close();
        server.close();
    }
    if (failures.length > 0) {
        console.error("Smoke test failed:\n  " + failures.join("\n  "));
        process.exit(1);
    }
    console.log("Smoke test passed: SimSet index and create pages render against the stubbed API");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
