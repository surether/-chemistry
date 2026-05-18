import { useEffect, useState } from 'react';
import { formatClock, formatKoreanDate } from '../utils/date';

export default function ClockWidget() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-w-[210px] rounded-2xl bg-white/6 px-4 py-3 text-right shadow-insetLine">
      <p className="font-mono text-3xl font-semibold tabular-nums text-chalk-100">{formatClock(now)}</p>
      <p className="mt-1 text-xs text-chalk-500">{formatKoreanDate(now)}</p>
    </div>
  );
}
