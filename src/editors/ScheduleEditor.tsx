import { useEffect, useMemo, useState } from 'react';
import type { ScheduleData, ScheduleItem, Weekday } from '../data/types';
import EditorModal from './EditorModal';

const weekdays: Array<{ key: Weekday; label: string }> = [
  { key: 'monday', label: '월' },
  { key: 'tuesday', label: '화' },
  { key: 'wednesday', label: '수' },
  { key: 'thursday', label: '목' },
  { key: 'friday', label: '금' }
];

interface ScheduleEditorProps {
  open: boolean;
  schedule: ScheduleData;
  onClose: () => void;
  onSave: (schedule: ScheduleData) => Promise<void>;
}

function copySchedule(schedule: ScheduleData): ScheduleData {
  return {
    monday: schedule.monday.map((item) => ({ ...item })),
    tuesday: schedule.tuesday.map((item) => ({ ...item })),
    wednesday: schedule.wednesday.map((item) => ({ ...item })),
    thursday: schedule.thursday.map((item) => ({ ...item })),
    friday: schedule.friday.map((item) => ({ ...item }))
  };
}

function normalizeItem(item: ScheduleItem): ScheduleItem {
  return {
    period: Number.isFinite(item.period) ? Math.max(1, Math.round(item.period)) : 1,
    className: item.className.trim(),
    subject: item.subject.trim(),
    unit: item.unit.trim(),
    room: item.room.trim()
  };
}

export default function ScheduleEditor({ open, schedule, onClose, onSave }: ScheduleEditorProps) {
  const [activeDay, setActiveDay] = useState<Weekday>('monday');
  const [draft, setDraft] = useState<ScheduleData>(() => copySchedule(schedule));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setDraft(copySchedule(schedule));
      setActiveDay('monday');
      setError(null);
    }
  }, [open, schedule]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(schedule), [draft, schedule]);

  function updateItem(index: number, patch: Partial<ScheduleItem>) {
    setDraft((current) => ({
      ...current,
      [activeDay]: current[activeDay].map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    }));
  }

  function addItem() {
    setDraft((current) => ({
      ...current,
      [activeDay]: [
        ...current[activeDay],
        { period: current[activeDay].length + 1, className: '', subject: '', unit: '', room: '' }
      ]
    }));
  }

  function deleteItem(index: number) {
    setDraft((current) => ({ ...current, [activeDay]: current[activeDay].filter((_, itemIndex) => itemIndex !== index) }));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const nextSchedule: ScheduleData = {
        monday: draft.monday.map(normalizeItem).sort((a, b) => a.period - b.period),
        tuesday: draft.tuesday.map(normalizeItem).sort((a, b) => a.period - b.period),
        wednesday: draft.wednesday.map(normalizeItem).sort((a, b) => a.period - b.period),
        thursday: draft.thursday.map(normalizeItem).sort((a, b) => a.period - b.period),
        friday: draft.friday.map(normalizeItem).sort((a, b) => a.period - b.period)
      };
      await onSave(nextSchedule);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '시간표를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorModal title="시간표 편집" open={open} dirty={dirty} saving={saving} error={error} onClose={onClose} onSave={save}>
      <div className="mb-4 flex flex-wrap gap-2">
        {weekdays.map((day) => (
          <button
            key={day.key}
            className={`tab-button no-drag ${activeDay === day.key ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActiveDay(day.key)}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {draft[activeDay].map((item, index) => (
          <div key={`${activeDay}-${index}`} className="editor-row grid grid-cols-[70px_1fr_1fr_1.4fr_1fr_auto] gap-2">
            <input className="editor-input" type="number" min={1} value={item.period} onChange={(event) => updateItem(index, { period: Number(event.target.value) })} />
            <input className="editor-input" value={item.className} placeholder="학급" onChange={(event) => updateItem(index, { className: event.target.value })} />
            <input className="editor-input" value={item.subject} placeholder="과목" onChange={(event) => updateItem(index, { subject: event.target.value })} />
            <input className="editor-input" value={item.unit} placeholder="단원" onChange={(event) => updateItem(index, { unit: event.target.value })} />
            <input className="editor-input" value={item.room} placeholder="장소" onChange={(event) => updateItem(index, { room: event.target.value })} />
            <button className="danger-button no-drag" type="button" onClick={() => deleteItem(index)}>
              삭제
            </button>
          </div>
        ))}
      </div>

      <button className="secondary-button no-drag mt-4" type="button" onClick={addItem}>
        교시 추가
      </button>
    </EditorModal>
  );
}
