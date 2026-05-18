# UI Review Checklist

Use this checklist after UI changes.

## Screen Purpose

- The screen clearly supports a teacher's daily glance workflow.
- Primary actions are refresh, checklist save, memo save, and link open.
- No marketing page or unrelated feature surface was added.

## Visual Review

- Visual hierarchy is clear.
- Spacing is consistent across columns and cards.
- Alignment is stable at 1920x1080, 1600x900, and narrower widths.
- Typography is deliberate for headings, labels, buttons, and data rows.
- Colors come from the design system.
- Cards and controls use consistent radius and borders.

## State Review

- Loading state exists.
- Empty schedule state exists.
- Error state exists.
- Save-in-progress state exists.
- Privacy warning appears near memo.

## Security Review

- Renderer does not import `fs`, `path`, or `shell`.
- File access goes through preload IPC.
- Allowed JSON filenames are explicitly listed.
- External links open through Electron main process.
- No analytics, telemetry, cloud sync, API keys, or external data integrations exist.

## Remaining Risk Review

- Mark uncertain assumptions.
- Do not add future features during MVP validation.
- If harness fails, fix only the first failing issue.
