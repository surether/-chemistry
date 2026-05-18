import WidgetCard from '../components/WidgetCard';
import type { ProgressItem } from '../data/types';

interface ProgressWidgetProps {
  progress: ProgressItem[];
  onEdit: () => void;
}

function statusClass(status: string): string {
  if (status.includes('보충')) {
    return 'text-focus-rose bg-focus-rose/12';
  }
  if (status.includes('예정')) {
    return 'text-focus-gold bg-focus-gold/12';
  }
  return 'text-focus-green bg-focus-green/12';
}

export default function ProgressWidget({ progress, onEdit }: ProgressWidgetProps) {
  return (
    <WidgetCard title="반별 진도" subtitle="단원과 차시 상태" editable onEdit={onEdit}>
      <div className="space-y-3">
        {progress.map((item) => (
          <article key={item.className} className="rounded-2xl border border-white/7 bg-white/5 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-chalk-100">
                  {item.className} · {item.unit}
                </p>
                <p className="mt-1 text-xs text-chalk-500">{item.lesson}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/35">
              <div className="h-full rounded-full bg-focus-teal" style={{ width: `${Math.min(100, Math.max(0, item.progressRate))}%` }} />
            </div>
            <p className="mt-2 text-right text-xs text-chalk-500">{item.progressRate}%</p>
          </article>
        ))}
      </div>
    </WidgetCard>
  );
}
