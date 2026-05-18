import WidgetCard from '../components/WidgetCard';
import type { MealData } from '../data/types';

interface MealWidgetProps {
  meal: MealData;
  onEdit: () => void;
}

export default function MealWidget({ meal, onEdit }: MealWidgetProps) {
  return (
    <WidgetCard
      title="오늘 급식"
      subtitle={meal.date}
      editable
      onEdit={onEdit}
      footer={
        <span>
          {meal.calorie ?? '열량 정보 없음'} · {meal.source === 'sample' ? '샘플 데이터' : meal.source}
        </span>
      }
    >
      <div className="flex flex-wrap gap-2">
        {meal.menu.map((item) => (
          <span key={item} className="rounded-full border border-white/8 bg-white/6 px-3 py-1.5 text-sm text-chalk-300">
            {item}
          </span>
        ))}
      </div>
    </WidgetCard>
  );
}
