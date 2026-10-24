// Generates every token file from tokens/*.json, the one source of the system's values:
//
//   app/assets/stylesheets/mudda_theme/tokens.css   light colour roles, faces, corner, focus ring
//   app/assets/stylesheets/mudda_theme/dark.css     dark colour roles, system-following and pinned
//   app/assets/stylesheets/mudda_theme/scale.css    type, spacing, rule and motion scales
//   lib/mudda_theme/palette.json                    the colour roles for Ruby (MuddaTheme::PALETTE)
//   web/tokens.json                                 every token, both schemes, for JS and the catalog
//   web/fonts.css                                   fonts.css with file-relative URLs, for npm users
//
// Style Dictionary resolves the tiers (primitive -> semantic -> component); this script formats
// the result. Run `npm run build` after editing tokens/, and commit what it writes.
import StyleDictionary from "style-dictionary";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const STYLESHEETS = "app/assets/stylesheets/mudda_theme";
const COMMON = [ "tokens/primitive/**/*.json", "tokens/semantic/font.json", "tokens/component/**/*.json", "tokens/scale/**/*.json" ];
const SCHEMES = {
  light: [ ...COMMON, "tokens/semantic/color.light.json" ],
  dark: [ ...COMMON, "tokens/semantic/color.dark.json" ]
};

// Semantic groups drop their group name (color.paper is --paper); everything else keeps its path.
const UNPREFIXED = new Set([ "color", "font", "shape" ]);
const GENERATED = "Generated from tokens/*.json by scripts/build.mjs: edit the JSON, then run `npm run build`.";

const cssName = path => (UNPREFIXED.has(path[0]) ? path.slice(1) : path).join("-");
const tier = path => (path[0] === "palette" ? "primitive" : path[0] === "focus-ring" ? "component" : UNPREFIXED.has(path[0]) ? "semantic" : "scale");
const reference = value => typeof value === "string" && value.match(/^\{([^}]+)\}$/)?.[1].split(".");

async function resolve(sources) {
  const sd = new StyleDictionary({ source: sources, log: { verbosity: "silent" }, platforms: { css: {} } });
  const { allTokens } = await sd.getPlatformTokens("css");
  return new Map(allTokens.map(token => [ cssName(token.path), token ]));
}

// A component token that points at a semantic one keeps the reference, so it follows the scheme.
function cssValue(token) {
  const ref = tier(token.path) === "component" && reference(token.original.$value);
  if (ref) return `var(--${cssName(ref)})`;
  if (token.$type === "cubicBezier") return `cubic-bezier(${token.$value.join(", ")})`;
  return String(token.$value);
}

const declarations = (tokens, test, indent = "  ") =>
  [ ...tokens.values() ].filter(token => test(token.path)).map(token => `${indent}--${cssName(token.path)}: ${cssValue(token)};`).join("\n");

const isColor = path => path[0] === "color";

function tokensCss(light) {
  return `/* mudda-theme: the manuscript look, light. Navy ink on cream paper, slate for quieter text, brass
   for labels and marks, vermilion as the one accent. Brass is a 3:1 accent on paper, so a surface
   that carries paper-coloured text (a secondary button, a warning badge) uses the deeper
   --brass-fill. Surfaces are flat and told apart by hairlines; corners are near-square.

   Tokens are named by role, so dark.css flips every colour under the same names. This file is
   self-contained (no url(), no layers) and doubles as the static copy for public/ pages.

   ${GENERATED} */
:root {
  color-scheme: light;

${declarations(light, isColor)}

${declarations(light, path => path[0] === "font")}

${declarations(light, path => path[0] === "shape")}

${declarations(light, path => path[0] === "focus-ring")}
}
`;
}

function darkCss(dark) {
  return `/* mudda-theme: the manuscript look, dark. Cream ink on night-navy paper, with brass and vermilion
   lifted for contrast. It redefines tokens.css's colour names, so load it after tokens.css; an app
   that never loads it stays light.

   It follows the system setting unless the page pins a scheme with <html data-theme="light|dark">.
   Both blocks below hold the same values. This file is self-contained and doubles as the static
   copy for public/ pages.

   ${GENERATED} */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;

${declarations(dark, isColor, "    ")}
  }
}

:root[data-theme="dark"] {
  color-scheme: dark;

${declarations(dark, isColor)}
}
`;
}

function scaleCss(light) {
  const group = name => declarations(light, path => path[0] === name);
  return `/* mudda-theme: the scales for plain-CSS apps. Type, spacing, the hairline's width and motion.
   Tailwind apps leave this file out: Tailwind's own scales use the same variable names.

   ${GENERATED} */
:root {
${group("text")}

${group("space")}

${group("rule")}

${group("ease")}
${group("dur")}
}
`;
}

const palette = scheme => Object.fromEntries([ ...scheme ].filter(([ , token ]) => isColor(token.path)).map(([ name, token ]) => [ name, token.$value ]));

function tokensJson(light, dark) {
  return [ ...light.values() ].map(token => {
    const name = cssName(token.path);
    const entry = { name, path: token.path.join("."), tier: tier(token.path), type: token.$type, value: cssValue(token) };
    if (isColor(token.path)) Object.assign(entry, { value: token.$value, dark: dark.get(name).$value });
    if (token.$description) entry.description = token.$description;
    return entry;
  });
}

async function write(file, content) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
  console.log(file);
}

const light = await resolve(SCHEMES.light);
const dark = await resolve(SCHEMES.dark);
const fonts = await readFile(`${STYLESHEETS}/fonts.css`, "utf8");

await write(`${STYLESHEETS}/tokens.css`, tokensCss(light));
await write(`${STYLESHEETS}/dark.css`, darkCss(dark));
await write(`${STYLESHEETS}/scale.css`, scaleCss(light));
await write("lib/mudda_theme/palette.json", JSON.stringify({ light: palette(light), dark: palette(dark) }, null, 2) + "\n");
await write("web/tokens.json", JSON.stringify(tokensJson(light, dark), null, 2) + "\n");
await write("web/fonts.css", `/* fonts.css for bundlers (Vite, Astro): the same faces, with URLs relative to this file.
   ${GENERATED} */
${fonts.replaceAll('url("/mudda_theme/', 'url("../app/assets/fonts/mudda_theme/')}`);
