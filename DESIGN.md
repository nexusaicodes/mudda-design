# Design rules

The rules every Mudda app follows. [VISION.md](VISION.md) says why; this file says how. Each app
keeps its own page shapes and copy in its own design doc and never overrides what is here: when
the system needs to grow, it grows here first. [INVENTORY.md](INVENTORY.md) lists where the apps
still differ.

## Tokens

- **Use semantic names only:** `--paper`, `--ink`, `--vermilion`, `--corner`, … Never a raw
  value, and never a `palette.*` primitive. A Tailwind app reaches them through daisyUI's roles
  (`bg-base-100`, `text-error`, `btn-primary`).
- **Tiers.** Primitives (`tokens/primitive/`) name the palette. Semantic tokens
  (`tokens/semantic/`) name roles and point at primitives; each colour role has a light and a dark
  value under one name. Component tokens (`tokens/component/`) name one component's choices and
  point at roles. Scales (`tokens/scale/`) are for plain-CSS apps; Tailwind apps keep Tailwind's.
- **Changing a value** means editing the JSON, running `npm run build`, and releasing. Never edit
  generated files.

## Colour

| Role | Use |
|---|---|
| `--paper`, `--paper-200`, `--paper-300` | The page, a raised surface, a higher or pressed one |
| `--ink` | Text, primary buttons, links |
| `--ink-muted` | Secondary text, a primary button's hover |
| `--brass` | Large labels and marks only: it is 3:1 on paper, never small text |
| `--brass-fill` | Brass surfaces that carry paper-coloured text (secondary, warning) |
| `--vermilion` | The one accent: focus, errors, the overdue. Nothing decorative |
| `--hairline` | 1px rules between surfaces |

Ink and slate pass WCAG AA (4.5:1) on every paper in both schemes; paper passes it on every
fill. `bundle exec rake contrast` checks every pair, and CI runs it.

## Type

- **Display:** Amiri 700, upright; headings are never italic. **Body:** IBM Plex Sans 400, with
  IBM Plex Sans Arabic for Arabic. **Mono:** JetBrains Mono, for code, commands and URLs only.
- Self-host every face from this gem. Never fetch fonts from a third party.
- Code, commands and URLs read left to right inside Arabic text.

## Shape and depth

- One corner, `--corner` (3px), on buttons, inputs, cards and bars.
- Nothing casts a shadow. Surfaces are told apart by `--paper-*` steps and hairlines.

## Focus

Every focusable element shows a ring when focused from the keyboard: `--focus-ring-width` solid
`--focus-ring-color`, offset `--focus-ring-offset`. The gem's base.css sets it; don't remove it.

## Actions

Three levels, the same in every app:

1. **Primary**: a filled ink button with a short verb label that never wraps. One per view.
2. **Secondary**: the same button, outlined, for an equal-weight second action beside it.
3. **Tertiary**: an underlined link with a trailing arrow that turns with the text's direction.

Plain-CSS apps use components.css (`.button`, `.button.is-outline`, `.link-arrow`); Tailwind apps
use daisyUI (`btn btn-primary`, `btn btn-outline`, a link).

## Motion

Almost none: colour shifts on hover (`--dur-micro`, `--ease-out`), a 1px press, a fade on menus.
`prefers-reduced-motion` turns all of it off.

## Direction and language

- Use logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`) and,
  in Tailwind, logical utilities (`ms-*`, `ps-*`, `start-*`), so Arabic mirrors on its own.
- Every screen ships in English and Arabic.

## Schemes

`dark.css` makes a page follow the system's light or dark setting; `<html data-theme="light|dark">`
pins one. An app that leaves dark.css out stays light. Whether an app offers dark mode is the
app's decision (see the inventory).

## Brand

- The wordmark is "mudda", lowercase, in Amiri Bold: `wordmark.svg` on paper,
  `wordmark-on-dark.svg` on night paper. Live text in Amiri is the same mark where the font loads.
- The logo is the five bars: `logo.svg` beside a wordmark or alone in a header; `mark.svg`, on
  the ink tile, for icons. Never recolour or restyle either.
- Favicons and app icons come from `npm run icons`; apps link them, never draw their own.

## Copy

- Talk about recording and moving work, not "managing" it. Keep it short.
- "Sign in", never "log in".
- Claim only what the product does today; no invented numbers, testimonials or logos.
