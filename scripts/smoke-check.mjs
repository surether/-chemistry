import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'package.json',
  'index.html',
  'vite.config.ts',
  'tsconfig.json',
  'tailwind.config.js',
  'postcss.config.js',
  'electron/main.ts',
  'electron/preload.ts',
  'src/main.tsx',
  'src/App.jsx',
  'src/App.css',
  'src/assets/alchemy-meadow-battle.png',
  'src/assets/parchment-panel.png',
  'src/components/DashboardShell.tsx',
  'src/components/WidgetCard.tsx',
  'src/components/TopBar.tsx',
  'src/components/BottomDock.tsx',
  'src/widgets/ClockWidget.tsx',
  'src/widgets/TeacherInfoWidget.tsx',
  'src/widgets/TodayScheduleWidget.tsx',
  'src/widgets/MealWidget.tsx',
  'src/widgets/CalendarWidget.tsx',
  'src/widgets/DdayWidget.tsx',
  'src/widgets/ProgressWidget.tsx',
  'src/widgets/TaskWidget.tsx',
  'src/widgets/QuickLinksWidget.tsx',
  'src/widgets/MemoWidget.tsx',
  'src/widgets/WeatherPlaceholderWidget.tsx',
  'src/editors/EditorModal.tsx',
  'src/editors/ScheduleEditor.tsx',
  'src/editors/MealEditor.tsx',
  'src/editors/CalendarEditor.tsx',
  'src/editors/DdayEditor.tsx',
  'src/editors/ProgressEditor.tsx',
  'src/editors/LinksEditor.tsx',
  'src/editors/TaskInlineEditor.tsx',
  'src/editors/MemoInlineEditor.tsx',
  'src/editors/SettingsPanel.tsx',
  'src/data/types.ts',
  'src/data/dataClient.ts',
  'src/data/useDashboardData.ts',
  'src/utils/date.ts',
  'src/utils/safeOpen.ts',
  'src/styles/globals.css',
  'docs/design.md',
  'docs/privacy.md',
  'docs/harness.md',
  'README.md'
];

const dataFiles = [
  'schedule.json',
  'meal.json',
  'calendar.json',
  'dday.json',
  'progress.json',
  'tasks.json',
  'links.json',
  'memo.json',
  'settings.json',
  'window-state.json'
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const file of requiredFiles) {
  assert(fs.existsSync(path.join(root, file)), `Missing file: ${file}`);
}

for (const file of dataFiles) {
  const filePath = path.join(root, 'local-data', file);
  assert(fs.existsSync(filePath), `Missing data file: ${file}`);
  JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

console.log('smoke-check ok');
