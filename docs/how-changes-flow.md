# How a change flows

From a designer's decision to every app. The point is to review the system once, not each app.

## Three layers, shared three ways

| Layer | Examples | Shared how |
|---|---|---|
| Tokens | colours, type, spacing, corners, motion | One JSON source, generated for every platform |
| Components | button, input, card | One written spec, built once per platform |
| Patterns and vision | page shapes, voice | Docs: VISION.md, DESIGN.md |

A button can't be shared between the web and iOS, but its colours, corner and spacing can. Tokens
are the shared language; each platform's components are built from them, so they look like
siblings.

## A token change

Say the accent should be a warmer red and the corner 4px.

```
 Figma                       mudda-design                                apps
───────                     ──────────────                              ──────
designer edits the   ──PR──▶ tokens/*.json changes
variables and pushes          CI: npm run build (generated files must match)
(Tokens Studio sync)          CI: contrast check in both schemes
                              CI: catalog screenshots, light/dark × LTR/RTL
                              review: the JSON diff + the screenshots
                              merge → bump version → tag vX.Y.Z
                                         │
                       ┌─────────────────┼──────────────────┬───────────────────┐
                       ▼                 ▼                  ▼                   ▼
                  board, admin       platform             docs           iOS / Android
                  Gemfile tag        Gemfile tag      package.json tag    (when they exist)
                       │                 │                  │
                       └── one bump commit each; the app's tests and pages are the check
```

## A component change

Say a new "danger" button.

1. The designer updates the component and its spec: parts, states, the tokens it uses.
2. It is built per platform: components.css (plain-CSS web), the daisyUI mapping in the adapter
   (Tailwind web), a SwiftUI or Compose view later.
3. Each build is checked against the catalog.

That costs one build per platform, so components stay few, and tokens carry as much as they can.

## Versions

- **Patch** (0.2.1): a value changes, nothing renamed.
- **Minor** (0.3.0): something is added.
- **Major** (1.0.0): a token, class or file is renamed or removed. Keep the old name as an alias
  for one release where possible, so apps can bump without breaking.

Release: bump `lib/mudda_theme/version.rb`, `package.json` and `CHANGELOG.md`, commit, tag
`vX.Y.Z`, push the tag. Then bump each app.

## Mobile

Style Dictionary already resolves the tokens; adding iOS and Android is a matter of adding
outputs to `scripts/build.mjs`: Swift constants and asset-catalog colours with light and dark
values, and Android resources with a `values-night` folder. Units convert there too (rem to
points and dp). Fonts ship inside the apps under the same OFL licences; right-to-left layout is
native on both, but each component spec says what mirrors.
