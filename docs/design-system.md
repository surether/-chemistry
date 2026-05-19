# Design System

## Principles

- Preserve the fantasy chemistry game tone.
- Keep all visible UI text in Korean.
- Use existing React components and CSS classes before adding new abstractions.
- Keep controls readable on classroom projectors.
- Use text feedback in addition to animation.

## Layout

- Start screen: battle scene with title, subtitle, and start buttons.
- Guide/tutorial: centered parchment panels with short Korean explanations.
- Game screen: top battle scene, then status, spell cards, selected spell analysis, and event log.
- Spell cards may scroll internally when the number of cards grows.

## Typography

- Korean system sans stack.
- Large headings for screen titles.
- Compact headings inside cards and panels.
- Formula text should be bold and readable.
- Long card explanations should be clamped or wrapped without overlap.

## Colors

- Parchment panel: warm beige and brown.
- Button primary: amber/brown.
- Success: green/gold.
- Warning/danger: red/orange.
- Magic: cyan/violet/gold.
- Element cubes:
  - H: white
  - O: blue
  - C: black/gray
  - N: green
  - Cl: yellow-green
  - D: red

## Components

- `ElementCube`: colored cube with letter label.
- `SpellCard`: formula card with name, attack power, formula, required cubes, difficulty, and explanation.
- `ReactionAnalysis`: selected spell formula, required atom cubes, missing cubes, and molecule formula analysis.
- `BattleScene`: wizard/dragon background, HP bar, cube generation, and spell effect image.
- `GameGuideModal`: compact in-game help.

## States

- Empty cube rows show Korean empty-state copy.
- Castable spell cards glow.
- Locked spell cards stay visible and show missing atom cubes.
- Dragon cube danger triggers text feedback and animation.
- Victory/defeat screens summarize learning and strategy.

## Accessibility

- Buttons use semantic `button` elements.
- Focus outlines must stay visible.
- Cube letters are required so color is not the only cue.
- Important feedback appears as readable Korean text.
