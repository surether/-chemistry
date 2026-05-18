# Design System

## Principles

- Use app-specific design tokens instead of arbitrary colors.
- Keep UI and feature logic separated where practical.
- Prefer reusable widget cards and shared button styles.
- Define one screen purpose first: a glanceable local-first teacher dashboard.
- Include loading, empty, and error states.
- Avoid whole-app redesigns after the first MVP screen is established.

## Layout

- TopBar: product title, real-time clock, teacher information, privacy status.
- TopBar also acts as the drag handle in widget mode.
- Left column: today's schedule, meal, weather placeholder.
- Center grid: calendar, class progress, tasks.
- Right column: D-day, quick links, memo.
- BottomDock: refresh, settings placeholder, load/save status, version.

## Typography

- System sans stack with Korean fallback.
- Headings: semibold, compact line height.
- Widget titles: 15px semibold.
- Body text: 13px to 14px.
- Utility labels: 11px to 12px.
- Clock: monospace tabular numerals.

## Colors

- Background: `#101113`.
- Panel: `#17191d`.
- Strong panel: `#1e2227`.
- Text: `#f5f7f2`.
- Muted text: `#aab4a3`.
- Teal accent: `#4fd1c5`.
- Gold accent: `#f5c76b`.
- Rose accent: `#ef8aa0`.
- Green accent: `#8bd17c`.

## Components

- `WidgetCard`: title, optional subtitle, body, optional footer.
- `WidgetCard` editable variant: hover hint, pointer cursor, subtle border/surface lift.
- `EditorModal`: shared modal for card editing.
- `SettingsPanel`: side panel for display and teacher settings.
- Buttons: compact rounded rectangle, shared focus ring, no browser-default typography.
- Progress bars: neutral track with teal fill.
- Status badges: small rounded labels with semantic color.
- Text areas: dark inset surface with visible focus state.

## States

- Loading: centered local JSON loading indicator.
- Empty: dashed quiet panel with plain Korean copy.
- Error: rose emphasis and retry action.
- Saving: disabled controls where a duplicate write could happen.
- Editable: hover hint says "클릭해서 수정".
- Unsaved modal close: confirm before discarding changes.

## Accessibility

- Preserve focus-visible outlines.
- Keep contrast high on dark theme.
- Use semantic buttons and labels for interactive controls.
- Avoid motion-heavy behavior; spinner is the only active animation.
