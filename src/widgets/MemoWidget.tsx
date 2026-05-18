import WidgetCard from '../components/WidgetCard';
import type { MemoData } from '../data/types';
import type { LoadStatus } from '../data/useDashboardData';
import MemoInlineEditor from '../editors/MemoInlineEditor';

interface MemoWidgetProps {
  memo: MemoData;
  dataStatus: LoadStatus;
  onSave: (memo: MemoData) => Promise<void>;
}

export default function MemoWidget({ memo, dataStatus, onSave }: MemoWidgetProps) {
  return (
    <WidgetCard
      title="일반 메모"
      subtitle="카드를 클릭해 바로 수정"
      footer={<span>개인정보 없는 업무 메모만 작성하세요.</span>}
    >
      <MemoInlineEditor memo={memo} dataStatus={dataStatus} onSave={onSave} />
    </WidgetCard>
  );
}
