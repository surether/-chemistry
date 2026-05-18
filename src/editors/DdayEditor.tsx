import { useEffect, useMemo, useState } from 'react';
import type { DdayItem } from '../data/types';
import EditorModal from './EditorModal';

interface DdayEditorProps {
  open: boolean;
  items: DdayItem[];
  onClose: () => void;
  onSave: (items: DdayItem[]) => Promise<void>;
}

export default function DdayEditor({ open, items, onClose, onSave }: DdayEditorProps) {
  const [draft, setDraft] = useState<DdayItem[]>(items);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(items), [draft, items]);

  useEffect(() => {
    if (open) {
      setDraft(items.map((item) => ({ ...item })));
      setError(null);
    }
  }, [open, items]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave([...draft].sort((a, b) => a.date.localeCompare(b.date)));
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'D-day를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorModal title="D-day 편집" open={open} dirty={dirty} saving={saving} error={error} onClose={onClose} onSave={save}>
      <div className="space-y-3">
        {draft.map((item, index) => (
          <div key={`${item.title}-${index}`} className="editor-row grid grid-cols-[1fr_150px_auto] gap-2">
            <input
              className="editor-input"
              value={item.title}
              placeholder="제목"
              onChange={(event) => setDraft((current) => current.map((value, itemIndex) => (itemIndex === index ? { ...value, title: event.target.value } : value)))}
            />
            <input
              className="editor-input"
              type="date"
              value={item.date}
              onChange={(event) => setDraft((current) => current.map((value, itemIndex) => (itemIndex === index ? { ...value, date: event.target.value } : value)))}
            />
            <button className="danger-button no-drag" type="button" onClick={() => setDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
              삭제
            </button>
          </div>
        ))}
      </div>
      <button className="secondary-button no-drag mt-4" type="button" onClick={() => setDraft((current) => [...current, { title: '', date: new Date().toISOString().slice(0, 10) }])}>
        D-day 추가
      </button>
    </EditorModal>
  );
}
