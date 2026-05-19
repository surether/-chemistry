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

const appSource = fs.readFileSync(path.join(root, 'src', 'App.jsx'), 'utf8');
const expectedFormulas = ['H₂', 'O₂', 'N₂', 'CO₂', 'O₃', 'CO', 'H₂O', 'H₂O₂', 'CH₄', 'NH₃', 'HCl', 'C₆H₁₂O₆'];
const expectedSpellImages = [
  'spellHydroSlash',
  'spellOxyBlade',
  'spellNitroBarrier',
  'spellCarbonSmoke',
  'spellCarbonBurst',
  'spellOzoneSpark',
  'spellWaterBomb',
  'spellPeroxideFlash',
  'spellMethaneInferno',
  'spellAmmoniaVeil',
  'spellAcidSting',
  'spellGlucoseNova'
];

for (const formula of expectedFormulas) {
  assert(appSource.includes(`formula: "${formula}"`), `Missing molecule spell formula: ${formula}`);
}

for (const spellImage of expectedSpellImages) {
  assert(appSource.includes(`image: ${spellImage}`), `Missing spell image binding: ${spellImage}`);
}

assert(appSource.includes('...Array(20).fill("H")'), 'Initial bag must contain 20 H cubes');
assert(appSource.includes('...Array(18).fill("O")'), 'Initial bag must contain 18 O cubes');
assert(appSource.includes('...Array(8).fill("C")'), 'Initial bag must contain 8 C cubes');
assert(appSource.includes('...Array(8).fill("N")'), 'Initial bag must contain 8 N cubes');
assert(appSource.includes('...Array(4).fill("Cl")'), 'Initial bag must contain 4 Cl cubes');
assert(appSource.includes('...Array(8).fill("D")'), 'Initial bag must contain 8 D cubes');
assert(!appSource.includes('reactants:'), 'Molecule spell data must not use reactants');
assert(!appSource.includes('products:'), 'Molecule spell data must not use products');
assert(!appSource.includes('equation:'), 'Molecule spell data must not use equation');
assert(fs.readFileSync(path.join(root, 'public', 'sw.js'), 'utf8').includes('chemistry-dragon-molecule-v4'), 'Service worker cache must be bumped for molecule cards');

console.log('smoke-check ok');
