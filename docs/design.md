# Design Notes

This MVP uses a single dark widget dashboard screen for a Windows dual-monitor teacher workflow.

The layout follows the provided graph:

- `DashboardShell` owns the page grid.
- `TopBar` shows identity, clock, and local-data context.
- Left column shows today's schedule, meal, and weather placeholder.
- Center column shows calendar, class progress, and tasks.
- Right column shows D-day, quick links, and memo.
- `BottomDock` shows refresh, settings placeholder, save/load status, and version.
- Editable cards expose a quiet "클릭해서 수정" hint on hover.
- Modal editors are used for schedule, meal, calendar, D-day, progress, and links.
- Inline editors are used for tasks and memo.
- The TopBar is the drag handle for the frameless widget window.

The visual system is intentionally restrained:

- dark graphite background for side-monitor use
- card widgets with rounded corners
- enough spacing for quick scanning
- teal/gold/rose/green semantic accents
- minimal animation
- transparent Electron window background
- translucent widget root with backdrop blur
- click-to-edit affordances that stay subtle until hover

No student names, grades, counseling notes, school account login, analytics, or external data sync are part of this design.
