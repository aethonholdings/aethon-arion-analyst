// Shared helpers for e2e/record.js and e2e/smoke.js.
const http = require("http");
const fs = require("fs");
const path = require("path");

const dist = path.resolve(__dirname, "..", "dist", "arion", "analyst");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".ico": "image/x-icon", ".svg": "image/svg+xml" };

/** Serves the built app with an SPA fallback on a free port. */
function serve() {
    if (!fs.existsSync(path.join(dist, "index.html"))) throw new Error(`build the app first: ${dist} not found`);
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            let file = path.join(dist, decodeURIComponent(req.url.split("?")[0]));
            if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, "index.html");
            res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
            fs.createReadStream(file).pipe(res);
        });
        server.listen(0, "127.0.0.1", () => resolve(server));
    });
}

/** Fixture key of an API request: method, path and sorted query. */
function key(method, url) {
    const query = [...url.searchParams.entries()].sort().map(([k, v]) => `${k}=${v}`).join("&");
    return `${method} ${url.pathname}${query ? "?" + query : ""}`;
}

/** Opens a route, waits for the network to settle, checks its text and opens its tabs. */
async function visit(page, base, route) {
    await page.goto(base + route.path);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    for (const text of route.text || []) await page.getByText(text).first().waitFor({ state: "attached", timeout: 15000 });
    for (const tab of route.tabs || []) {
        await page.getByText(tab, { exact: true }).first().click();
        await page.waitForLoadState("networkidle", { timeout: 20000 });
    }
}

module.exports = { serve, key, visit };
