import ClockWidget from '../widgets/ClockWidget';
import TeacherInfoWidget from '../widgets/TeacherInfoWidget';
import type { DashboardData } from '../data/types';
import type { LoadStatus } from '../data/useDashboardData';

interface TopBarProps {
  data: DashboardData | null;
  status: LoadStatus;
}

export default function TopBar({ data, status }: TopBarProps) {
  return (
    <header className="drag-region grid grid-cols-[1fr_auto] items-center gap-5 rounded-[18px] border border-white/8 bg-ink-900/70 px-6 py-4 shadow-widget shadow-insetLine">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-focus-teal">Widget Dashboard</p>
        <h1 className="mt-1 truncate text-2xl font-semibold text-chalk-100">교사용 듀얼모니터 대시보드</h1>
      </div>
      <div className="no-drag flex items-center gap-4">
        <ClockWidget />
        <TeacherInfoWidget settings={data?.settings ?? null} status={status} />
      </div>
    </header>
  );
}
