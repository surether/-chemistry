import WidgetCard from '../components/WidgetCard';
import type { DdayItem } from '../data/types';
import { daysBetweenToday, formatDday } from '../utils/date';

interface DdayWidgetProps {
  items: DdayItem[];
  onEdit: () => void;
}

export default function DdayWidget({ items, onEdit }: DdayWidgetProps) {
  const sorted = [...items].sort((a, b) => daysBetweenToday(a.date) - daysBetweenToday(b.date));

  return (
    <WidgetCard title="D-day" subtitle="주요 일정까지 남은 날짜" editable onEdit={onEdit}>
      <ul className="space-y-3">
        {sorted.map((item) => (
          <li key={`${item.title}-${item.date}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3">
            <div>
              <p className="text-sm font-semibold text-chalk-100">{item.title}</p>
              <p className="mt-1 text-xs text-chalk-500">{item.date}</p>
            </div>
            <span className="rounded-full bg-focus-rose/12 px-3 py-1 text-sm font-semibold text-focus-rose">{formatDday(item.date)}</span>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
}
