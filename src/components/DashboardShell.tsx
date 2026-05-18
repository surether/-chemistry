import { useEffect, useState } from 'react';
import type { DashboardDataState } from '../data/useDashboardData';
import BottomDock from './BottomDock';
import TopBar from './TopBar';
import CalendarWidget from '../widgets/CalendarWidget';
import DdayWidget from '../widgets/DdayWidget';
import MealWidget from '../widgets/MealWidget';
import MemoWidget from '../widgets/MemoWidget';
import ProgressWidget from '../widgets/ProgressWidget';
import QuickLinksWidget from '../widgets/QuickLinksWidget';
import TaskWidget from '../widgets/TaskWidget';
import TodayScheduleWidget from '../widgets/TodayScheduleWidget';
import WeatherPlaceholderWidget from '../widgets/WeatherPlaceholderWidget';
import CalendarEditor from '../editors/CalendarEditor';
import DdayEditor from '../editors/DdayEditor';
import LinksEditor from '../editors/LinksEditor';
import MealEditor from '../editors/MealEditor';
import ProgressEditor from '../editors/ProgressEditor';
import ScheduleEditor from '../editors/ScheduleEditor';
import SettingsPanel from '../editors/SettingsPanel';

interface DashboardShellProps {
  dashboard: DashboardDataState;
}

type ActiveEditor = 'schedule' | 'meal' | 'calendar' | 'dday' | 'progress' | 'links' | 'settings' | null;

export default function DashboardShell({ dashboard }: DashboardShellProps) {
  const {
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
  } = dashboard;
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>(null);

  useEffect(() => {
    return window.dashboardApi?.onOpenSettings(() => setActiveEditor('settings'));
  }, []);

  return (
    <main className="widget-root p-5 text-chalk-100">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-[1920px] flex-col gap-4">
        <TopBar data={data} status={status} />

        {status === 'loading' && !data ? (
          <section className="grid flex-1 place-items-center rounded-[20px] border border-white/8 bg-ink-900/84">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-focus-teal/25 border-t-focus-teal motion-safe:animate-spin" />
              <p className="text-sm text-chalk-300">로컬 JSON 데이터를 불러오는 중입니다.</p>
            </div>
          </section>
        ) : data ? (
          <section className="dashboard-grid min-h-0 flex-1">
            <div className="column-stack">
              <TodayScheduleWidget schedule={data.schedule} onEdit={() => setActiveEditor('schedule')} />
              <MealWidget meal={data.meal} onEdit={() => setActiveEditor('meal')} />
              <WeatherPlaceholderWidget />
            </div>

            <div className="column-stack">
              <CalendarWidget calendar={data.calendar} onEdit={() => setActiveEditor('calendar')} />
              <ProgressWidget progress={data.progress} onEdit={() => setActiveEditor('progress')} />
              <TaskWidget tasks={data.tasks} onSave={updateTasks} dataStatus={status} />
            </div>

            <div className="column-stack">
              <DdayWidget items={data.dday} onEdit={() => setActiveEditor('dday')} />
              <QuickLinksWidget links={data.links} onEdit={() => setActiveEditor('links')} />
              <MemoWidget memo={data.memo} onSave={updateMemo} dataStatus={status} />
            </div>
          </section>
        ) : (
          <section className="grid flex-1 place-items-center rounded-[20px] border border-focus-rose/25 bg-focus-rose/8">
            <div className="max-w-xl text-center">
              <h2 className="text-xl font-semibold text-chalk-100">데이터를 불러오지 못했습니다.</h2>
              <p className="mt-2 text-sm text-chalk-300">{error ?? 'local-data 폴더와 JSON 파일을 확인하세요.'}</p>
              <button className="primary-button mt-5" type="button" onClick={() => void refresh()}>
                다시 시도
              </button>
            </div>
          </section>
        )}

        <BottomDock status={status} error={error} lastLoadedAt={lastLoadedAt} onRefresh={() => void refresh()} onOpenSettings={() => setActiveEditor('settings')} />

        {data ? (
          <>
            <ScheduleEditor open={activeEditor === 'schedule'} schedule={data.schedule} onClose={() => setActiveEditor(null)} onSave={updateSchedule} />
            <MealEditor open={activeEditor === 'meal'} meal={data.meal} onClose={() => setActiveEditor(null)} onSave={updateMeal} />
            <CalendarEditor open={activeEditor === 'calendar'} calendar={data.calendar} onClose={() => setActiveEditor(null)} onSave={updateCalendar} />
            <DdayEditor open={activeEditor === 'dday'} items={data.dday} onClose={() => setActiveEditor(null)} onSave={updateDday} />
            <ProgressEditor open={activeEditor === 'progress'} progress={data.progress} onClose={() => setActiveEditor(null)} onSave={updateProgress} />
            <LinksEditor open={activeEditor === 'links'} links={data.links} onClose={() => setActiveEditor(null)} onSave={updateLinks} />
            <SettingsPanel open={activeEditor === 'settings'} settings={data.settings} onClose={() => setActiveEditor(null)} onSave={updateSettings} />
          </>
        ) : null}
      </div>
    </main>
  );
}
