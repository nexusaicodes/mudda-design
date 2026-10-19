# mudda-theme

The manuscript look shared by Mudda's apps: navy ink on cream paper, Amiri headings over IBM Plex
body text, flat surfaces drawn with hairlines, near-square corners, and vermilion as the one accent.
There is an opt-in dark variant, with cream ink on night-navy paper.

It ships as a Rails engine gem, so a Propshaft app gets the CSS and fonts on its load path without
copying anything, and a tailwindcss-rails app gets a Tailwind/daisyUI adapter. It needs no Node.

## Install

```ruby
# Gemfile
gem "mudda-theme", github: "nexusaicodes/mudda-theme", tag: "v0.1.1"
```

To upgrade, change the tag and run `bundle update mudda-theme`.

## What it ships

| Asset (logical path)        | What it is                                                                  |
| --------------------------- | --------------------------------------------------------------------------- |
| `mudda_theme/tokens.css`    | The light tokens, as plain custom properties on `:root`. Self-contained.    |
| `mudda_theme/dark.css`      | The dark tokens under the same names. Opt-in. Self-contained.               |
| `mudda_theme/fonts.css`     | `@font-face` for the three families, split by unicode-range.                |
| `mudda_theme/base.css`      | Paper and ink on the page, Amiri headings, a vermilion focus ring (`@layer base`). |
| `mudda_theme/*.woff2`       | The font files (OFL; see `licenses/`).                                      |
| `app/assets/tailwind/mudda_theme/engine.css` | The Tailwind v4 + daisyUI 5 adapter.                       |

### Tokens

| Token          | Light                   | Dark                       | Use                                   |
| -------------- | ----------------------- | -------------------------- | ------------------------------------- |
| `--paper`      | `#f1e6ce`               | `#0e1830`                  | Page background                       |
| `--paper-200`  | `#e9dcc0`               | `#15233f`                  | Raised surface                        |
| `--paper-300`  | `#dfd0b0`               | `#1c2c4d`                  | Higher surface, pressed state         |
| `--ink`        | `#1b2a4a`               | `#efe4cb`                  | Text, primary fills                   |
| `--ink-muted`  | `#46536e`               | `#a7b0c2`                  | Quieter text                          |
| `--brass`      | `#8c6a2e`               | `#c9a56a`                  | Large labels, marks                   |
| `--brass-fill` | `#7f5f28`               | `#c9a56a`                  | Brass surfaces under paper-coloured text (secondary, warning) |
| `--vermilion`  | `#b3341c`               | `#e5583b`                  | The accent: focus, alerts, marks      |
| `--hairline`   | `rgb(27 42 74 / 0.2)`   | `rgb(201 165 106 / 0.22)`  | 1px rules between surfaces            |
| `--face-body`  | IBM Plex Sans, IBM Plex Sans Arabic, system stack |   | Body text                        |
| `--face-display` | Amiri, Noto Naskh Arabic, Georgia, serif |          | Headings                              |
| `--corner`     | `3px`                   |                            | Corner radius                         |

Ink and slate pass WCAG AA (4.5:1) on every paper in both schemes, and paper text passes it on
every fill (ink, slate, brass-fill, vermilion). Brass and vermilion as text on paper pass the 3:1
for large text and UI marks, so keep them off small body text. `bundle exec rake contrast` checks
every pair.

## Use it in a Propshaft app (plain CSS)

```erb
<%= stylesheet_link_tag "mudda_theme/fonts", "mudda_theme/tokens", "mudda_theme/dark", "mudda_theme/base", :app %>
```

Leave out `mudda_theme/dark` to stay light. With it, the page follows the system setting, and
`<html data-theme="light">` or `data-theme="dark"` pins one.

## Use it in a tailwindcss-rails app (Tailwind v4, optionally daisyUI 5)

tailwindcss-rails (4.x) finds the engine and writes `app/assets/builds/tailwind/mudda_theme.css`
on every `tailwindcss:build` and `tailwindcss:watch`. Import that file **after** the daisyUI plugin:

```css
@import "tailwindcss";
@plugin "./daisyui.mjs" { themes: retro --default; }
@import "../builds/tailwind/mudda_theme";
/* your own CSS */
```

The adapter brings in tokens, fonts and base. It also maps `--font-sans` and `--font-display`, makes
every themed Tailwind shadow a transparent zero shadow (so rings still draw), maps daisyUI's roles
(base, primary, secondary, accent, neutral, info, success, warning, error, the radii) to the tokens,
and draws a hairline round `.card`, `.modal-box`, `.dropdown-content` and a plain `.alert`.
daisyUI's bordered variants (`card-border`, `card-dash`, the alert colours and styles) and the
app's own border utilities keep their borders. For dark mode, also link `mudda_theme/dark` with
`stylesheet_link_tag`.

The engine keeps `app/assets/tailwind/` out of the Propshaft load path, so the adapter is never
published as a stylesheet of its own.

## Outside the asset pipeline

- **Static pages** (`public/404.html` and the like): `bin/rails mudda_theme:sync_static` copies
  `tokens.css` and `dark.css` to `public/mudda-theme/`. Link them from the page. To catch a theme
  bump that hasn't been re-synced, add this test:

  ```ruby
  assert_empty MuddaTheme.stale_static_files(Rails.root.join("public/mudda-theme"))
  ```

- **Ruby** (inline mailer styles, generated SVGs): `MuddaTheme::PALETTE[:light][:ink]` is `"#1b2a4a"`. `MuddaTheme::INKS` holds the four inks.
  `MuddaTheme.font_path("amiri-latin-700-normal.woff2")` is a font file's absolute path, for
  embedding. The palette is read from the CSS, so the CSS stays the one source.

## Develop

```sh
bundle install
bundle exec rake        # tests + contrast check
```

Release: bump `lib/mudda_theme/version.rb` and `CHANGELOG.md`, then tag `vX.Y.Z` and push the tag.

## Licence

The code is under MIT (see `LICENSE`). Amiri, IBM Plex Sans and IBM Plex Sans Arabic are under the SIL Open Font License 1.1
(`licenses/`).
