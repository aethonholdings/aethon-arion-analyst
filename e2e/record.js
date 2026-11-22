// Records the API responses the analyst requests on each route in e2e/routes.js from a live, seeded server
// (default http://127.0.0.1:3000) into e2e/fixtures/api.json, for replay by e2e/smoke.js.
// Run with: ARION_API=http://127.0.0.1:3000 node e2e/record.js (after npm run build -- --configuration development)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { serve, key, visit } = require("./harness");
const routes = require("./routes");

const api = process.env.ARION_API || "http://127.0.0.1:3000";

async function main() {
    const server = await serve();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const fixtures = {};
    try {
        const page = await browser.newPage();
        await page.route("http://localhost:3000/arion/**", async (route) => {
            const request = route.request();
            const url = new URL(request.url());
            const response = await route.fetch({ url: api + url.pathname + url.search });
            const body = await response.text();
            fixtures[key(request.method(), url)] = { status: response.status(), body: JSON.parse(body) };
            return route.fulfill({ response, body });
        });
        for (const route of routes) {
            await visit(page, base, route);
            if (process.env.SHOTS) await page.screenshot({ path: path.join(process.env.SHOTS, route.path.replace(/\//g, "_") + ".png"), fullPage: true });
        }
    } finally {
        await browser.close();
        server.close();
    }
    const file = path.join(__dirname, "fixtures", "api.json");
    fs.writeFileSync(file, JSON.stringify(fixtures) + "\n");
    console.log(`Recorded ${Object.keys(fixtures).length} responses to ${file}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
