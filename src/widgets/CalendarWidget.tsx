import WidgetCard from '../components/WidgetCard';
import type { CalendarItem } from '../data/types';

interface CalendarWidgetProps {
  calendar: CalendarItem[];
  onEdit: () => void;
}

function isToday(date: string): boolean {
  return date === new Date().toISOString().slice(0, 10);
}

function typeLabel(type: CalendarItem['type']): string {
  const labels: Record<CalendarItem['type'], string> = {
    meeting: '협의',
    assessment: '평가',
    event: '행사',
    etc: '기타'
  };
  return labels[type];
}

export default function CalendarWidget({ calendar, onEdit }: CalendarWidgetProps) {
  const sorted = [...calendar].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <WidgetCard title="학사일정" subtitle="다가오는 일정" editable onEdit={onEdit}>
      <ul className="space-y-3">
        {sorted.map((item) => (
          <li
            key={`${item.date}-${item.title}`}
            className={`rounded-2xl border p-3 ${isToday(item.date) ? 'border-focus-gold/40 bg-focus-gold/10' : 'border-white/7 bg-white/5'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-chalk-100">{item.title}</p>
              <span className="rounded-full bg-white/8 px-2 py-1 text-[11px] text-chalk-300">{typeLabel(item.type)}</span>
            </div>
            <p className="mt-1 text-xs text-chalk-500">{item.date}</p>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
