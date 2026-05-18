import { useEffect, useMemo, useState } from 'react';
import type { CalendarItem } from '../data/types';
import EditorModal from './EditorModal';

interface CalendarEditorProps {
  open: boolean;
  calendar: CalendarItem[];
  onClose: () => void;
  onSave: (calendar: CalendarItem[]) => Promise<void>;
}

const calendarTypes: CalendarItem['type'][] = ['meeting', 'assessment', 'event', 'etc'];

export default function CalendarEditor({ open, calendar, onClose, onSave }: CalendarEditorProps) {
  const [draft, setDraft] = useState<CalendarItem[]>(calendar);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(calendar), [draft, calendar]);

  useEffect(() => {
    if (open) {
      setDraft(calendar.map((item) => ({ ...item })));
      setError(null);
    }
  }, [open, calendar]);

  function updateItem(index: number, patch: Partial<CalendarItem>) {
    setDraft((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave([...draft].sort((a, b) => a.date.localeCompare(b.date)));
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '일정을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorModal title="학사일정 편집" open={open} dirty={dirty} saving={saving} error={error} onClose={onClose} onSave={save}>
      <div className="space-y-3">
        {draft.map((item, index) => (
          <div key={`${item.date}-${index}`} className="editor-row grid grid-cols-[150px_1fr_130px_auto] gap-2">
            <input className="editor-input" type="date" value={item.date} onChange={(event) => updateItem(index, { date: event.target.value })} />
            <input className="editor-input" value={item.title} placeholder="일정 제목" onChange={(event) => updateItem(index, { title: event.target.value })} />
            <select className="editor-input" value={item.type} onChange={(event) => updateItem(index, { type: event.target.value as CalendarItem['type'] })}>
              {calendarTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button className="danger-button no-drag" type="button" onClick={() => setDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
              삭제
            </button>
          </div>
        ))}
      </div>
      <button className="secondary-button no-drag mt-4" type="button" onClick={() => setDraft((current) => [...current, { date: new Date().toISOString().slice(0, 10), title: '', type: 'etc' }])}>
        일정 추가
      </button>
    </EditorModal>
  );
}
