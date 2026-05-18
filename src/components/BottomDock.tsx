import type { LoadStatus } from '../data/useDashboardData';

interface BottomDockProps {
  status: LoadStatus;
  error: string | null;
  lastLoadedAt: Date | null;
  onRefresh: () => void;
  onOpenSettings: () => void;
}

function statusLabel(status: LoadStatus): string {
  if (status === 'loading') {
    return '불러오는 중';
  }
  if (status === 'saving') {
    return '저장 중';
  }
  if (status === 'error') {
    return '확인 필요';
  }
  return '정상';
}

export default function BottomDock({ status, error, lastLoadedAt, onRefresh, onOpenSettings }: BottomDockProps) {
  const lastLoadedLabel = lastLoadedAt
    ? new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(lastLoadedAt)
    : '아직 없음';

  return (
    <footer className="no-drag flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-ink-900/70 px-5 py-3 text-sm text-chalk-300 shadow-insetLine">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-focus-teal/25 bg-focus-teal/10 px-3 py-1 text-xs font-semibold text-focus-teal">
          데이터 상태: {statusLabel(status)}
        </span>
        <span className="text-xs text-chalk-500">마지막 로드 {lastLoadedLabel}</span>
        {error ? <span className="text-xs text-focus-rose">{error}</span> : null}
      </div>
      <div className="flex items-center gap-2">
        <button className="dock-button no-drag" type="button" onClick={onRefresh}>
          새로고침
        </button>
        <button className="dock-button no-drag" type="button" onClick={onOpenSettings}>
          설정
        </button>
        <span className="rounded-full bg-white/6 px-3 py-1 text-xs text-chalk-500">v0.1.0 MVP</span>
      </div>
    </footer>
  );
}
