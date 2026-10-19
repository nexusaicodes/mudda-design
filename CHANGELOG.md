# Changelog

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
