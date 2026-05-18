import WidgetCard from '../components/WidgetCard';

export default function WeatherPlaceholderWidget() {
  return (
    <WidgetCard title="날씨 자리표시" subtitle="외부 API 연결 없음">
      <div className="rounded-2xl border border-dashed border-white/12 bg-white/4 p-4">
        <p className="text-sm leading-6 text-chalk-300">날씨 위젯은 추후 NEIS/공공데이터 연동 단계에서 추가 예정입니다.</p>
        <p className="mt-3 text-xs leading-5 text-chalk-500">이번 MVP는 외부 서버 전송과 API Key 저장을 포함하지 않습니다.</p>
      </div>
    </WidgetCard>
  );
}
