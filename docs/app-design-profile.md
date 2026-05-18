# App Design Profile

## App Type

교사용 Windows 듀얼모니터 업무 대시보드 앱.

## Target Users

중학교 교사가 보조 모니터에서 수업 준비, 오늘 일정, 급식, D-day, 할 일, 링크, 일반 메모를 한 화면에서 확인한다.

## Platform

- Windows desktop
- Electron shell
- React renderer
- 1920x1080 보조 모니터 우선

## UI Framework

- React
- TypeScript
- Tailwind CSS
- No existing component library

## Design Direction

- Transparent frameless widget shell with dark translucent dashboard surfaces.
- Card-based widgets with clear information hierarchy.
- Moderate density: enough data at a glance, but not crowded.
- Quiet professional tone for school staff work.
- Minimal animation.
- No decorative marketing hero.

## Design Tokens

- Background: graphite black, not pure blue.
- Panel: layered neutral dark surfaces.
- Accent colors: teal for local/active state, gold for caution/date emphasis, rose for errors/D-day, green for safe/privacy state.
- Radius: 12px controls, 18px cards.
- Shadow: soft dark elevation plus subtle inner top line.

## Main User Tasks

1. Read current time and teacher context.
2. Check today's timetable and meal.
3. Review calendar and D-day items.
4. Track class progress.
5. Save checklist changes.
6. Save general non-personal memo.
7. Open trusted links or local folders through Electron IPC.
8. Click cards directly to edit local dashboard data.
9. Use tray controls to show, hide, pin, or quit the widget.

## Uncertain Assumptions

- exact school PC security policy: uncertain.
- exact preferred monitor placement: uncertain.
- exact Windows font availability beyond system Korean fonts: uncertain.
