// Serves _site/ (run `npm run site` first) and screenshots the catalog in each scheme and direction,
// to screenshots/<theme>-<dir>.png. CI uploads them with every run, so a change can be reviewed by
// looking at the system rather than at each app.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const SITE = "_site";
const OUT = "screenshots";
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };

const server = createServer(async (request, response) => {
  const path = normalize(decodeURIComponent(new URL(request.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  const file = join(SITE, path.endsWith("/") ? `${path}index.html` : path);
  try {
    response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(await readFile(file));
  } catch {
    response.writeHead(404).end();
  }
}).listen(0);
const base = `http://localhost:${server.address().port}/catalog/`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
for (const theme of [ "light", "dark" ]) {
  for (const dir of [ "ltr", "rtl" ]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`${base}?theme=${theme}&dir=${dir}`);
    await page.waitForSelector("body[data-ready]");
    await page.evaluate(() => document.fonts.ready);
    if (errors.length) throw new Error(`catalog (${theme}, ${dir}): ${errors.join("; ")}`);
    await page.screenshot({ path: `${OUT}/${theme}-${dir}.png`, fullPage: true });
    console.log(`${OUT}/${theme}-${dir}.png`);
    await page.close();
  }
}
await browser.close();
server.close();
