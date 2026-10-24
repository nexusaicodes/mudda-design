# Inventory

Every component and pattern Mudda's apps draw, where each one comes from, and where the apps still
disagree. v0 of the system captured the apps as they were; the **Open** rows are decisions for the
designer, not settled design. Once one is decided, the system implements it and the row moves to
**Shared**.

Apps: **board** (`mudda`, Tailwind + daisyUI), **platform** (`mudda-platform`, plain CSS),
**docs** (`mudda-docs`, Astro Starlight). The **admin** site, when it exists, follows the board's
stack.

## Foundations

| Thing | Status | Board | Platform | Docs |
|---|---|---|---|---|
| Colour roles (`--paper`, `--ink`, …) | Shared | via the daisyUI adapter | tokens.css | mapped onto Starlight's `--sl-color-*` |
| Light and dark values | Shared | light only, by choice (see Dark mode) | both | both |
| Faces: Amiri, Plex Sans, Plex Sans Arabic | Shared | yes, plus a Segoe UI Variable fallback before Segoe UI | yes | yes |
| Mono face | **Open** | `ui-monospace` | JetBrains Mono | JetBrains Mono |
| Type scale | **Open** | Tailwind's default scale | scale.css (`--text-xs` … `--text-display`) | Starlight's scale |
| Spacing scale | **Open** | Tailwind's default spacing | scale.css (`--space-3xs` … `--space-4xl`) | Starlight's spacing |
| Corner | Shared | 3px through daisyUI's radii | 3px | 3px |
| No shadows, hairlines | Shared | adapter zeroes shadows, rules cards and menus | by hand | by hand |
| Motion | **Open** | Tailwind defaults, a flash animation | scale.css eases and durations | Starlight defaults |
| Heading set | **Open** | gem base: Amiri 700 | gem base, plus line-height 1.08 and -0.02em tracking | Amiri 700 |

## Components

| Thing | Status | Board | Platform | Docs |
|---|---|---|---|---|
| Focus ring | **Open** | gem's vermilion ring, but the lanes' own controls use an ink ring (`board.css`) | vermilion, offset 3px with a 2px radius; inputs offset 1px | Starlight's |
| Buttons: primary, outline, link with arrow | **Open** (shape shared) | daisyUI `btn`, `btn-outline` | components.css `.button`, `.is-outline`, `.link-arrow` | Starlight's buttons; `.copy-page` by hand |
| Text inputs | **Open** | daisyUI `input` | `.form input`, and the `.slug` address field | Starlight's search |
| Links in prose | **Open** | daisyUI `link` | ink, underlined, slate on hover | Starlight's, in the accent |
| Cards and surfaces | **Open** | daisyUI `card` with the adapter's hairline | `.plan-card`, the demo board | Starlight's cards |
| Alerts and errors | **Open** | daisyUI `alert` | `.errors` (vermilion outline) | Starlight's asides |
| Icons | **Open** | ~25 SVGs as CSS masks (`app/assets/images`) | inline SVGs (menu, theme switch) | Starlight's icon set |
| Code highlighting | **Open** | none | none (plain mono) | Expressive Code's theme colours, off-palette |
| API method badges (GET, PATCH, …) | **Open** | — | — | starlight-openapi's own blue, teal and red |

## Patterns

| Thing | Status | Board | Platform | Docs |
|---|---|---|---|---|
| Header | **Open** | one row: logo, back link, title, search, avatar | floating frosted bar, phone menu | Starlight's header |
| Dark mode | **Open** | none, by choice (board AGENTS.md: "one deliberate look") | follows the system, with a header switch | Starlight's switch, dark by default |
| Error pages | **Open** | a centred vermilion "stamp" with wavy lines (`public/error.css`), light only | left-aligned, wordmark and button, light and dark (inline styles) | Starlight's 404 |
| Page shapes | App's own | the board's lanes; phones turn it on its side | home's three screens, the 7:5 split, the 46rem reading column | Starlight's layout |
| Email | Platform only | no email | inline styles from `MuddaTheme::PALETTE`, the wordmark as Amiri text (falls back to Georgia in mail clients) | none |

## Brand

| Thing | Status | Notes |
|---|---|---|
| Wordmark | Shared | `wordmark.svg` / `wordmark-on-dark.svg`: "mudda" in Amiri Bold, outlined. The platform still sets it as live text in its nav and footer, which renders the same. |
| Logo (the five bars) | Shared | `logo.svg` for headers; `mark.svg` on the ink tile for icons. Replaces the board's glossy bars. |
| Favicons and app icons | Shared | Generated from the marks by `npm run icons`. |

## Product-specific, not shared

- **Dirham sign** (platform): three single-glyph fonts with `size-adjust` in the platform's
  `tokens.css`. Moves here when a second app shows prices.
- **Lane colours** (board): `--color-card-*`, from the theme's inks; part of the board's data.
- **Arabic search folding**, **time zones**, and other behaviour: not design.

## Fixed in v0

- `.link-arrow`'s arrow pointed the same way in Arabic, so it pointed backwards. It now turns
  with the text's direction.
