# Vision

> **Draft.** Gathered from what Mudda's apps and docs already decide. The product owner edits and
> owns this file; everything else in this repo follows from it.

## What Mudda is

A board for you and your AI. You put work down; Claude, or any AI over MCP, adds cards, moves them
along and notes what it did. Mudda is for solopreneurs who would rather **record** work than
manage it.

## Who uses the screens, and how

- **Agents do most of the work**, through the API and MCP. People and agents are equals: they
  move cards the same way, a card from an agent lands in the same lane as one from a person, and
  nothing is set aside for a person to review.
- **People glance.** The browser is for an occasional look: what's in Doing, what's due. So the
  chrome stays small, every screen reads at a glance, and nothing depends on being learned. No
  keyboard shortcuts, no filter panels, no settings to tune.
- **The marketing site is read once.** It has one job, signing up, and says it calmly.

## Character: the manuscript

A working page, not a dashboard. Navy ink on cream paper, like a ledger or a manuscript leaf.

- **Calm and editorial.** Few elements, generous space, short sentences.
- **Flat.** Surfaces are told apart by hairlines, never shadows. Corners are near-square.
- **One accent, used sparingly.** Vermilion marks what needs attention: focus, errors, the
  overdue. Brass labels and marks. Everything else is ink and paper.
- **Type does the work.** Amiri for headings and the wordmark, IBM Plex for reading. Headings are
  never italic.
- **Almost no motion.** Colour shifts on hover, a press, a fade. Reduced motion turns it off.

## Two languages as equals

English and Arabic are both first languages, not a translation layer. Every screen is designed in
both, right-to-left mirrors properly, and the faces cover both scripts (Amiri, Plex Sans and Plex
Sans Arabic).

## Honest by default

Claim only what the product does today. No invented numbers, testimonials or logos. An example
board is clearly an example. Prices are stated plainly, with VAT included.

## How the system grows

- **The system before the page.** A new need becomes a token, a building block or a rule here
  first, then pages use it. Pages don't override the system.
- **Tokens carry the design.** Colours, type, space, shape and motion are decided once, in
  `tokens/`, and generated for every platform: web today, iOS and Android later.
- **Components are shared by spec.** Each platform builds its own, from the same tokens and the
  same written spec, so they look like siblings.
- **One way to build each thing per platform.** New Rails apps use Tailwind with daisyUI and
  this gem's adapter.

## Fixed, and open

**Fixed** (change only with the owner): the audience and the one selling point, agents and people
as equals, glanceable over interactive, the two languages, honesty in copy.

**Open to the designer:** everything about how it looks and feels, within the character above:
the palette's values, type and spacing scales, components, page patterns, dark mode on the board,
the icon set, the error pages. `INVENTORY.md` lists where the apps disagree today: those are the
first decisions.
