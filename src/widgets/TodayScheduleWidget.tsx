import type { ScheduleData } from '../data/types';
import { getTodayWeekday, getWeekdayLabel } from '../utils/date';
import WidgetCard from '../components/WidgetCard';

interface TodayScheduleWidgetProps {
  schedule: ScheduleData;
  onEdit: () => void;
}

export default function TodayScheduleWidget({ schedule, onEdit }: TodayScheduleWidgetProps) {
  const weekday = getTodayWeekday();
  const lessons = weekday ? [...schedule[weekday]].sort((a, b) => a.period - b.period) : [];

  return (
    <WidgetCard title="오늘 시간표" subtitle={getWeekdayLabel(weekday)} editable onEdit={onEdit}>
      {lessons.length === 0 ? (
        <p className="empty-text">오늘 등록된 수업이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {lessons.map((lesson) => (
            <li key={`${lesson.period}-${lesson.className}`} className="rounded-2xl border border-white/7 bg-white/5 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-chalk-100">
                    {lesson.period}교시 · {lesson.className}
                  </p>
                  <p className="mt-1 text-xs text-chalk-500">{lesson.room}</p>
                </div>
                <span className="rounded-full bg-focus-teal/12 px-2.5 py-1 text-xs font-semibold text-focus-teal">{lesson.subject}</span>
              </div>
              <p className="mt-3 text-sm text-chalk-300">{lesson.unit}</p>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  );
}
