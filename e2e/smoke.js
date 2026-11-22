// Smoke test: serves the built app (npm run build -- --configuration development) and drives every route in
// e2e/routes.js in Chromium, replaying the API responses recorded by e2e/record.js from a seeded server.
// Fails on a page error, a console error, an API request without a recorded response, or missing page text.
// Run with: npm run test:smoke
const path = require("path");
const { chromium } = require("playwright");
const { serve, key, visit } = require("./harness");
const routes = require("./routes");
const fixtures = require(path.join(__dirname, "fixtures", "api.json"));

async function main() {
    const server = await serve();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const failures = [];
    const used = new Set();
    try {
        const page = await browser.newPage();
        let current = "";
        page.on("pageerror", (error) => failures.push(`${current}: page error: ${error.message}`));
        page.on("console", (message) => {
            if (message.type() === "error") failures.push(`${current}: console error: ${message.text()}`);
        });
        await page.route("http://localhost:3000/arion/**", (route) => {
            const request = route.request();
            const k = key(request.method(), new URL(request.url()));
            const fixture = fixtures[k];
            if (!fixture) {
                failures.push(`${current}: no recorded response for ${k}`);
                return route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ success: false }) });
            }
            used.add(k);
            return route.fulfill({ status: fixture.status, contentType: "application/json", body: JSON.stringify(fixture.body) });
        });
        for (const route of routes) {
            current = route.path;
            try {
                await visit(page, base, route);
            } catch (error) {
                failures.push(`${route.path}: ${error.message.split("\n")[0]}`);
            }
        }
    } finally {
        await browser.close();
        server.close();
    }
    const unused = Object.keys(fixtures).filter((k) => !used.has(k));
    if (unused.length > 0) failures.push(`recorded responses no route requested (re-record?): ${unused.join(", ")}`);
    if (failures.length > 0) {
        console.error("Smoke test failed:\n  " + failures.join("\n  "));
        process.exit(1);
    }
    console.log(`Smoke test passed: ${routes.length} routes rendered against ${used.size} recorded API responses`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
