# App Design Profile

## App Type

Korean middle-school science fantasy learning game. The app teaches molecule formulas, atom counts, and cube collection through a wizard-versus-dragon battle.

## Target Users

- Middle-school science learners using Chromebook or desktop Chrome.
- Teachers projecting the game in class or sharing a GitHub Pages URL.

## Platform

- Browser-first Vite React web app.
- PWA-capable static deployment through GitHub Pages.
- Optional Electron wrapper exists, but the primary delivery path is web.

## UI Framework

- React renderer.
- Plain CSS in `src/App.css`.
- No component library.

## Design Direction

- Classroom-friendly classic fantasy board-game style.
- Pixel-art meadow battle scene, parchment panels, element cubes, spell cards with generated spell images, dragon HP, and animated spell effects.
- Korean-only visible UI.
- One-screen or compact-scroll gameplay, with clear panels for status, spell cards, analysis, and log.

## Design Tokens

- Background: sky/meadow fantasy scene.
- Panels: parchment beige with warm brown borders.
- Buttons: amber/brown fantasy buttons with visible focus and touch-friendly sizing.
- Magic effects: cyan, gold, violet, green.
- Cubes: element-specific colors with letters as non-color cues.
- Radius: 8px for cards and panels.

## Main User Tasks

1. Start the game and read the guide/tutorial.
2. Draw cubes and decide when to stop.
3. Collect element cubes in inventory.
4. Select a molecule spell card.
5. Read the selected molecule formula analysis and required atom cubes.
6. Cast spells to reduce dragon HP.
7. Review feedback and restart after victory or defeat.

## Uncertain Assumptions

- Exact classroom display size varies.
- Chromebook PWA install availability depends on school policy.
- Current molecule formula cards are intentionally formula-composition cards, not full real-world reaction systems.
