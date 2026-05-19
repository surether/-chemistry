# UI Review Checklist

## Screen Purpose

- The current screen supports the chemistry fantasy learning loop.
- Spell cards clearly show molecule name, formula, attack power, required cubes, and explanation.
- Spell cards show a generated image matched to the spell name.
- Molecule formula analysis remains visible for the selected formula.

## Visual Review

- Fantasy parchment style is preserved.
- Spell cards do not overlap.
- The spell list can scroll internally when many cards are present.
- Text fits inside cards, buttons, and panels at desktop and compact widths.
- `Cl` cube is visually distinct and readable.
- Attack/effect images remain decorative and do not hide key text.
- The attack effect uses the same image as the selected spell card.

## State Review

- Empty inventory and turn cube states are readable.
- Missing cube warning appears on locked spells.
- Castable state is visually distinct.
- Dragon danger state gives text feedback.
- Result screen still shows victory/defeat details.

## Learning Review

- Formula cards match the requested molecule formulas.
- Required atom cube counts match each formula.
- Explanations do not claim that the cards are full chemical reaction systems.
- HCl includes the added chlorine cube.

## Deployment Review

- `npm run lint` passes.
- `npm run smoke` passes.
- `npm run build` passes.
- Browser check passes at `/‑chemistry/`.
- GitHub Pages workflow remains present.
