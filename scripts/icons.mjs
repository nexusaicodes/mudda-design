// Renders the app icons and favicons from mark.svg and mark-maskable.svg, in headless Chromium:
//
//   favicon.ico                    16, 32 and 48px, for browsers that ask for /favicon.ico
//   favicon-96.png                 the PNG favicon
//   apple-touch-icon.png           180px, full bleed (iOS rounds the corners itself)
//   app-icon-192.png, -512.png     the rounded tile, for web app manifests
//   app-icon-192-maskable.png, -512-maskable.png
//                                  full bleed with the bars inside the safe zone, for "maskable"
//
// Run `npm run icons` after changing either mark, and commit what it writes.
import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";

const DIR = "app/assets/images/mudda_theme";
const OUTPUTS = [
  [ "mark.svg", "favicon-96.png", 96 ],
  [ "mark-maskable.svg", "apple-touch-icon.png", 180 ],
  [ "mark.svg", "app-icon-192.png", 192 ],
  [ "mark.svg", "app-icon-512.png", 512 ],
  [ "mark-maskable.svg", "app-icon-192-maskable.png", 192 ],
  [ "mark-maskable.svg", "app-icon-512-maskable.png", 512 ]
];
const ICO_SIZES = [ 16, 32, 48 ];

const browser = await chromium.launch();

async function render(svgFile, size) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const svg = await readFile(`${DIR}/${svgFile}`, "utf8");
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  const png = await page.screenshot({ omitBackground: true });
  await page.close();
  return png;
}

// An ICO file holding PNG images: a 6-byte header, a 16-byte entry per image, then the PNGs.
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([ header, ...images.map(image => image.png) ]);
}

for (const [ source, file, size ] of OUTPUTS) {
  await writeFile(`${DIR}/${file}`, await render(source, size));
  console.log(`${DIR}/${file}`);
}

const images = [];
for (const size of ICO_SIZES) images.push({ size, png: await render("mark.svg", size) });
await writeFile(`${DIR}/favicon.ico`, ico(images));
console.log(`${DIR}/favicon.ico`);

await browser.close();
