import type { SettingsData } from '../data/types';
import type { LoadStatus } from '../data/useDashboardData';

interface TeacherInfoWidgetProps {
  settings: SettingsData | null;
  status: LoadStatus;
}

export default function TeacherInfoWidget({ settings, status }: TeacherInfoWidgetProps) {
  return (
    <div className="min-w-[240px] rounded-2xl border border-white/8 bg-white/6 px-4 py-3 shadow-insetLine">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-chalk-100">{settings?.teacherName ?? '교사 정보'}</p>
          <p className="truncate text-xs text-chalk-500">
            {settings ? `${settings.schoolName} · ${settings.grade}` : '로컬 설정 불러오는 중'}
          </p>
        </div>
        <span className="rounded-full bg-focus-green/12 px-2.5 py-1 text-[11px] font-semibold text-focus-green">
          {status === 'error' ? '점검' : '로컬'}
        </span>
      </div>
      {settings?.privacyMode ? <p className="mt-2 text-[11px] text-focus-gold">개인정보 보호 모드 활성화</p> : null}
    </div>
  );
}
