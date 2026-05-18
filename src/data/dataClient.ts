const allowedDataFiles = [
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
] as const;

export type DataFileName = (typeof allowedDataFiles)[number];

const allowedDataFileSet = new Set<string>(allowedDataFiles);

function ensureAllowed(fileName: string): asserts fileName is DataFileName {
  if (!allowedDataFileSet.has(fileName)) {
    throw new Error(`허용되지 않은 데이터 파일입니다: ${fileName}`);
  }
}

function storageKey(fileName: DataFileName): string {
  return `teacher-dashboard:${fileName}`;
}

export async function readJson<T>(fileName: DataFileName): Promise<T> {
  ensureAllowed(fileName);

  if (window.dashboardApi) {
    return window.dashboardApi.readJson(fileName) as Promise<T>;
  }

  const stored = window.localStorage.getItem(storageKey(fileName));
  if (stored) {
    return JSON.parse(stored) as T;
  }

  const response = await fetch(`/local-data/${fileName}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`${fileName} 파일을 불러오지 못했습니다.`);
  }

  return response.json() as Promise<T>;
}

export async function writeJson(fileName: DataFileName, data: unknown): Promise<void> {
  ensureAllowed(fileName);

  if (window.dashboardApi) {
    await window.dashboardApi.writeJson(fileName, data);
    return;
  }

  window.localStorage.setItem(storageKey(fileName), JSON.stringify(data));
}

export async function openTarget(target: string, kind: 'url' | 'path'): Promise<void> {
  if (window.dashboardApi) {
    await window.dashboardApi.openTarget(target, kind);
    return;
  }

  if (kind === 'url') {
    window.open(target, '_blank', 'noopener,noreferrer');
  }
}
