// Assembles _site/, the catalog as GitHub Pages serves it: the catalog page beside the system's own
// files, at the same relative paths as in the repo, and a root page that sends visitors to it.
import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const SITE = "_site";
const COPIED = [
  "catalog",
  "web",
  "package.json",
  "app/assets/stylesheets/mudda_theme",
  "app/assets/fonts/mudda_theme",
  "app/assets/images/mudda_theme"
];

await rm(SITE, { recursive: true, force: true });
for (const path of COPIED) {
  await mkdir(`${SITE}/${path}`.replace(/\/[^/]+$/, ""), { recursive: true });
  await cp(path, `${SITE}/${path}`, { recursive: true });
}
await writeFile(`${SITE}/index.html`, `<!doctype html>
<meta charset="utf-8">
<title>Mudda design system</title>
<meta http-equiv="refresh" content="0; url=catalog/">
<a href="catalog/">Mudda design system</a>
`);
console.log(`${SITE}/catalog/index.html`);
