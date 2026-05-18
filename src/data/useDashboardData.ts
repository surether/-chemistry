import { useCallback, useEffect, useMemo, useState } from 'react';
import { readJson, writeJson } from './dataClient';
import type {
  CalendarItem,
  DashboardData,
  DdayItem,
  MealData,
  MemoData,
  ProgressItem,
  ScheduleData,
  SettingsData,
  TaskItem,
  LinkItem,
  WindowStateData
} from './types';

export type LoadStatus = 'loading' | 'ready' | 'saving' | 'error';

export interface DashboardDataState {
  data: DashboardData | null;
  status: LoadStatus;
  error: string | null;
  lastLoadedAt: Date | null;
  refresh: () => Promise<void>;
  updateSchedule: (schedule: ScheduleData) => Promise<void>;
  updateMeal: (meal: MealData) => Promise<void>;
  updateCalendar: (calendar: CalendarItem[]) => Promise<void>;
  updateDday: (dday: DdayItem[]) => Promise<void>;
  updateProgress: (progress: ProgressItem[]) => Promise<void>;
  updateTasks: (tasks: TaskItem[]) => Promise<void>;
  updateLinks: (links: LinkItem[]) => Promise<void>;
  updateMemo: (memo: MemoData) => Promise<void>;
  updateSettings: (settings: SettingsData) => Promise<void>;
}

async function loadDashboardData(): Promise<DashboardData> {
  const [schedule, meal, calendar, dday, progress, tasks, links, memo, settings, windowState] = await Promise.all([
    readJson<ScheduleData>('schedule.json'),
    readJson<MealData>('meal.json'),
    readJson<CalendarItem[]>('calendar.json'),
    readJson<DdayItem[]>('dday.json'),
    readJson<ProgressItem[]>('progress.json'),
    readJson<TaskItem[]>('tasks.json'),
    readJson<LinkItem[]>('links.json'),
    readJson<MemoData>('memo.json'),
    readJson<SettingsData>('settings.json'),
    readJson<WindowStateData>('window-state.json')
  ]);

  return { schedule, meal, calendar, dday, progress, tasks, links, memo, settings, windowState };
}

export function useDashboardData(): DashboardDataState {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setStatus((current) => (current === 'ready' ? 'loading' : current));
    setError(null);

    try {
      const nextData = await loadDashboardData();
      setData(nextData);
      setLastLoadedAt(new Date());
      setStatus('ready');
    } catch (loadError) {
      setStatus('error');
      setError(loadError instanceof Error ? loadError.message : '데이터를 불러오지 못했습니다.');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveDataSlice = useCallback(
    async <K extends keyof DashboardData>(fileName: Parameters<typeof writeJson>[0], key: K, value: DashboardData[K], fallbackMessage: string) => {
      if (!data) {
        return;
      }

      setStatus('saving');
      setError(null);

      try {
        await writeJson(fileName, value);
        setData({ ...data, [key]: value });
        setStatus('ready');
      } catch (saveError) {
        setStatus('error');
        setError(saveError instanceof Error ? saveError.message : fallbackMessage);
        throw saveError;
      }
    },
    [data]
  );

  const updateSchedule = useCallback(
    (schedule: ScheduleData) => saveDataSlice('schedule.json', 'schedule', schedule, '시간표를 저장하지 못했습니다.'),
    [saveDataSlice]
  );

  const updateMeal = useCallback((meal: MealData) => saveDataSlice('meal.json', 'meal', meal, '급식을 저장하지 못했습니다.'), [saveDataSlice]);

  const updateCalendar = useCallback(
    (calendar: CalendarItem[]) => saveDataSlice('calendar.json', 'calendar', calendar, '일정을 저장하지 못했습니다.'),
    [saveDataSlice]
  );

  const updateDday = useCallback((dday: DdayItem[]) => saveDataSlice('dday.json', 'dday', dday, 'D-day를 저장하지 못했습니다.'), [saveDataSlice]);

  const updateProgress = useCallback(
    (progress: ProgressItem[]) => saveDataSlice('progress.json', 'progress', progress, '진도를 저장하지 못했습니다.'),
    [saveDataSlice]
  );

  const updateTasks = useCallback((tasks: TaskItem[]) => saveDataSlice('tasks.json', 'tasks', tasks, '할 일을 저장하지 못했습니다.'), [saveDataSlice]);

  const updateLinks = useCallback((links: LinkItem[]) => saveDataSlice('links.json', 'links', links, '링크를 저장하지 못했습니다.'), [saveDataSlice]);

  const updateMemo = useCallback(
    (memo: MemoData) => saveDataSlice('memo.json', 'memo', memo, '메모를 저장하지 못했습니다.'),
    [saveDataSlice]
  );

  const updateSettings = useCallback(
    (settings: SettingsData) => saveDataSlice('settings.json', 'settings', settings, '설정을 저장하지 못했습니다.'),
    [saveDataSlice]
  );

  return useMemo(
    () => ({
      data,
      status,
      error,
      lastLoadedAt,
      refresh,
      updateSchedule,
      updateMeal,
      updateCalendar,
      updateDday,
      updateProgress,
      updateTasks,
      updateLinks,
      updateMemo,
      updateSettings
    }),
    [
      data,
      status,
      error,
      lastLoadedAt,
      refresh,
      updateSchedule,
      updateMeal,
      updateCalendar,
      updateDday,
      updateProgress,
      updateTasks,
      updateLinks,
      updateMemo,
      updateSettings
    ]
  );
}
