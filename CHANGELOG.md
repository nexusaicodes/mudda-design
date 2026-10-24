# Changelog

## 0.2.0 (2026-10-25)

The theme becomes the design system, in the `mudda-design` repo (formerly `mudda-theme`). The gem
and the new npm package keep the name `mudda-theme`.

- **Tokens are generated** from `tokens/*.json` (DTCG format, Style Dictionary): primitives,
  semantic roles, component tokens and scales. `tokens.css` and `dark.css` keep every existing
  name and value.
- New tokens: `--face-mono` (JetBrains Mono, now self-hosted here) and the focus ring
  (`--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-color`), which base.css uses.
- `scale.css`: the type, spacing, rule and motion scales, for plain-CSS apps.
- `components.css`: `.button` (with `.is-outline`, `.is-compact`) and `.link-arrow`, for
  plain-CSS apps. The arrow now turns with the text's direction, so it no longer points backwards
  in Arabic.
- Brand assets in `mudda_theme/`: the wordmark (outlined Amiri, light and dark), the logo, the
  mark, favicons and app icons.
- `mudda_theme:sync_static` also copies `favicon.ico` and `mark.svg`.
- `MuddaTheme::PALETTE` reads `palette.json`, generated with the CSS. `Palette.read` takes a
  scheme (`:light`, `:dark`) rather than a CSS file and block.
- An npm package (`npm install github:nexusaicodes/mudda-design#v0.2.0`) for apps outside Rails.
- A catalog, published to GitHub Pages, with screenshots on every CI run.
- VISION.md, DESIGN.md, INVENTORY.md and docs/how-changes-flow.md.

## 0.1.1 (2026-10-19)

- `--brass-fill`, a deeper brass for daisyUI's secondary and warning fills, so their paper text
  passes 4.5:1 in light mode. The contrast check now holds paper on every fill to 4.5:1.
- Themed Tailwind shadows are a transparent zero shadow instead of `none`, which voided rings on
  the same element.
- The hairline no longer overrides daisyUI's bordered variants (alert colours and styles,
  `card-border`, `card-dash`) or the app's border utilities.
- The page keeps daisyUI's darkened background while a modal is open.
- `app/assets/tailwind/` is no longer published as a Propshaft asset.
- Amiri's Arabic subsets claim U+200C-200E, so joiners in Arabic headings stay in the Arabic file.
- `Palette.read` raises a clear error for a missing block; the `INKS` comment no longer claims an
  order by darkness.

## 0.1.0 (2026-10-19)

- The manuscript look: light tokens, an opt-in dark variant, base styles, and self-hosted Amiri,
  IBM Plex Sans and IBM Plex Sans Arabic.
- A Tailwind CSS v4 / daisyUI 5 adapter discovered by tailwindcss-rails.
- `MuddaTheme::PALETTE`, `MuddaTheme::INKS`, `MuddaTheme.font_path` and the
  `mudda_theme:sync_static` task for places the asset pipeline doesn't reach.
