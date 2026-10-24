# mudda-design

Mudda's design system: the tokens, fonts, building blocks and brand assets every Mudda app
shares. It ships as the **mudda-theme** gem for Rails apps and the **mudda-theme** npm package for
everything else, both from this repo at the same tag.

- **[Catalog](https://nexusaicodes.github.io/mudda-design/)**: every token, block and asset,
  light and dark, English and Arabic.
- **[VISION.md](VISION.md)**: why Mudda looks and behaves the way it does.
- **[DESIGN.md](DESIGN.md)**: the rules every app follows.
- **[INVENTORY.md](INVENTORY.md)**: what each app draws, and where they still disagree.
- **[How a change flows](docs/how-changes-flow.md)**: from a design decision to every app.

## What it ships

| File | What it is |
|---|---|
| `tokens/*.json` | **The source.** Design tokens in the DTCG format: primitives, semantic roles, component tokens, scales |
| `mudda_theme/tokens.css` | Light colour roles, faces, corner, focus ring. Generated. Self-contained |
| `mudda_theme/dark.css` | Dark colour roles under the same names. Generated. Opt-in |
| `mudda_theme/scale.css` | Type, spacing, rule and motion scales, for plain-CSS apps. Generated |
| `mudda_theme/fonts.css` | `@font-face` for Amiri, IBM Plex Sans, IBM Plex Sans Arabic and JetBrains Mono |
| `mudda_theme/base.css` | Paper and ink on the page, Amiri headings, the focus ring (`@layer base`) |
| `mudda_theme/components.css` | Buttons and the arrow link, for plain-CSS apps |
| `mudda_theme/*.svg`, `*.png`, `favicon.ico` | Wordmark, logo, mark, favicons and app icons |
| `app/assets/tailwind/mudda_theme/engine.css` | The Tailwind v4 + daisyUI 5 adapter |
| `lib/mudda_theme/palette.json` | The colour roles for Ruby (`MuddaTheme::PALETTE`). Generated |
| `web/tokens.json`, `web/fonts.css` | Every token for JS, and fonts.css with file-relative URLs. Generated |

### Colour roles

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#f1e6ce` | `#0e1830` | Page background |
| `--paper-200` | `#e9dcc0` | `#15233f` | Raised surface |
| `--paper-300` | `#dfd0b0` | `#1c2c4d` | Higher surface, pressed state |
| `--ink` | `#1b2a4a` | `#efe4cb` | Text, primary fills |
| `--ink-muted` | `#46536e` | `#a7b0c2` | Quieter text |
| `--brass` | `#8c6a2e` | `#c9a56a` | Large labels, marks |
| `--brass-fill` | `#7f5f28` | `#c9a56a` | Brass surfaces under paper-coloured text |
| `--vermilion` | `#b3341c` | `#e5583b` | The accent: focus, errors, the overdue |
| `--hairline` | `rgb(27 42 74 / 0.2)` | `rgb(201 165 106 / 0.22)` | 1px rules between surfaces |

Also `--face-body`, `--face-display`, `--face-mono`, `--corner` (3px) and
`--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-color`.

## Use it in a Propshaft app (plain CSS)

```ruby
gem "mudda-theme", github: "nexusaicodes/mudda-design", tag: "v0.2.0"
```

```erb
<%= stylesheet_link_tag "mudda_theme/fonts", "mudda_theme/tokens", "mudda_theme/dark",
      "mudda_theme/scale", "mudda_theme/base", "mudda_theme/components", :app %>
<%= image_tag "mudda_theme/wordmark.svg", alt: "mudda" %>
```

Leave out `mudda_theme/dark` to stay light. With it, the page follows the system setting, and
`<html data-theme="light">` or `data-theme="dark"` pins one. To upgrade, change the tag and run
`bundle update mudda-theme`.

## Use it in a tailwindcss-rails app (Tailwind v4, optionally daisyUI 5)

tailwindcss-rails (4.x) finds the engine and writes `app/assets/builds/tailwind/mudda_theme.css`
on every `tailwindcss:build` and `tailwindcss:watch`. Import that file **after** the daisyUI plugin:

```css
@import "tailwindcss";
@plugin "./daisyui.mjs" { themes: retro --default; }
@import "../builds/tailwind/mudda_theme";
/* your own CSS */
```

The adapter brings in tokens, fonts and base. It maps `--font-sans` and `--font-display`, makes
every themed Tailwind shadow a transparent zero shadow (so rings still draw), maps daisyUI's roles
(base, primary, secondary, accent, neutral, info, success, warning, error, the radii) to the tokens,
and draws a hairline round `.card`, `.modal-box`, `.dropdown-content` and a plain `.alert`.
daisyUI's bordered variants and the app's own border utilities keep their borders. Leave out
scale.css and components.css: Tailwind and daisyUI provide those. For dark mode, also link
`mudda_theme/dark` with `stylesheet_link_tag`.

The engine keeps `app/assets/tailwind/` out of the Propshaft load path, so the adapter is never
published as a stylesheet of its own.

## Use it from npm (Astro, Vite, anything with a bundler)

```sh
npm install github:nexusaicodes/mudda-design#v0.2.0
```

```css
@import "mudda-theme/fonts.css";
@import "mudda-theme/tokens.css";
@import "mudda-theme/dark.css";
```

Images are at `mudda-theme/images/<file>`, and every token, with both schemes' values, is in
`mudda-theme/tokens.json`. The package is installed straight from the tag; nothing is published to
the npm registry.

## Outside the asset pipeline

- **Static pages** (`public/404.html` and the like): `bin/rails mudda_theme:sync_static` copies
  `tokens.css`, `dark.css`, `favicon.ico` and `mark.svg` to `public/mudda-theme/`. Link them from
  the page. To catch a theme bump that hasn't been re-synced, add this test:

  ```ruby
  assert_empty MuddaTheme.stale_static_files(Rails.root.join("public/mudda-theme"))
  ```

- **Ruby** (inline mailer styles, generated SVGs): `MuddaTheme::PALETTE[:light][:ink]` is
  `"#1b2a4a"`. `MuddaTheme::INKS` holds the four inks. `MuddaTheme.font_path("amiri-latin-700-normal.woff2")`
  is a font file's absolute path, for embedding.

## Develop

```sh
bundle install && npm install
npm run build        # tokens/*.json → the generated files above; commit them
npm run icons        # mark.svg, mark-maskable.svg → favicons and app icons
python3 -I scripts/wordmark.py   # Amiri Bold → wordmark.svg (needs fonttools and brotli)
npm run site && npm run screenshots   # the catalog in _site/, screenshots in screenshots/
bundle exec rake     # Ruby tests + the contrast check
```

Open the catalog locally by serving the repo root (for example `python3 -m http.server`) and
visiting `/catalog/`. CI checks the generated files match the JSON, runs the tests and contrast
check, and attaches catalog screenshots to every run; pushes to `main` publish the catalog.

Release: bump `lib/mudda_theme/version.rb`, `package.json` and `CHANGELOG.md`, commit, then tag
`vX.Y.Z` and push the tag.

## Licence

The code is under MIT (see `LICENSE`). Amiri, IBM Plex Sans, IBM Plex Sans Arabic and JetBrains
Mono are under the SIL Open Font License 1.1 (`licenses/`).
