import { useEffect, useMemo, useState } from 'react';
import type { ProgressItem } from '../data/types';
import EditorModal from './EditorModal';

interface ProgressEditorProps {
  open: boolean;
  progress: ProgressItem[];
  onClose: () => void;
  onSave: (progress: ProgressItem[]) => Promise<void>;
}

export default function ProgressEditor({ open, progress, onClose, onSave }: ProgressEditorProps) {
  const [draft, setDraft] = useState<ProgressItem[]>(progress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(progress), [draft, progress]);

  useEffect(() => {
    if (open) {
      setDraft(progress.map((item) => ({ ...item })));
      setError(null);
    }
  }, [open, progress]);

  function updateItem(index: number, patch: Partial<ProgressItem>) {
    setDraft((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave(draft.map((item) => ({ ...item, progressRate: Math.min(100, Math.max(0, Math.round(item.progressRate))) })));
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '진도를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorModal title="반별 진도 편집" open={open} dirty={dirty} saving={saving} error={error} onClose={onClose} onSave={save}>
      <div className="space-y-3">
        {draft.map((item, index) => (
          <div key={`${item.className}-${index}`} className="editor-row grid grid-cols-[0.7fr_1fr_1fr_1fr_100px_auto] gap-2">
            <input className="editor-input" value={item.className} placeholder="반" onChange={(event) => updateItem(index, { className: event.target.value })} />
            <input className="editor-input" value={item.unit} placeholder="단원" onChange={(event) => updateItem(index, { unit: event.target.value })} />
            <input className="editor-input" value={item.lesson} placeholder="차시/내용" onChange={(event) => updateItem(index, { lesson: event.target.value })} />
            <input className="editor-input" value={item.status} placeholder="상태" onChange={(event) => updateItem(index, { status: event.target.value })} />
            <input
              className="editor-input"
              type="number"
              min={0}
              max={100}
              value={item.progressRate}
              onChange={(event) => updateItem(index, { progressRate: Number(event.target.value) })}
            />
            <button className="danger-button no-drag" type="button" onClick={() => setDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
              삭제
            </button>
          </div>
        ))}
      </div>
      <button className="secondary-button no-drag mt-4" type="button" onClick={() => setDraft((current) => [...current, { className: '', unit: '', lesson: '', status: '예정', progressRate: 0 }])}>
        진도 추가
      </button>
    </EditorModal>
  );
}
