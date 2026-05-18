import { useEffect, useMemo, useState } from 'react';
import type { MealData } from '../data/types';
import EditorModal from './EditorModal';

interface MealEditorProps {
  open: boolean;
  meal: MealData;
  onClose: () => void;
  onSave: (meal: MealData) => Promise<void>;
}

export default function MealEditor({ open, meal, onClose, onSave }: MealEditorProps) {
  const [draft, setDraft] = useState(meal);
  const [menuText, setMenuText] = useState(meal.menu.join('\n'));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentDraft = useMemo(() => ({ ...draft, menu: menuText.split('\n').map((item) => item.trim()).filter(Boolean) }), [draft, menuText]);
  const dirty = JSON.stringify(currentDraft) !== JSON.stringify(meal);

  useEffect(() => {
    if (open) {
      setDraft(meal);
      setMenuText(meal.menu.join('\n'));
      setError(null);
    }
  }, [open, meal]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave(currentDraft);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '급식을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorModal title="급식 편집" open={open} dirty={dirty} saving={saving} error={error} onClose={onClose} onSave={save}>
      <div className="editor-form">
        <label>
          <span>날짜</span>
          <input className="editor-input" type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} />
        </label>
        <label>
          <span>메뉴</span>
          <textarea className="editor-textarea" value={menuText} onChange={(event) => setMenuText(event.target.value)} />
        </label>
        <label>
          <span>열량</span>
          <input className="editor-input" value={draft.calorie ?? ''} onChange={(event) => setDraft({ ...draft, calorie: event.target.value })} />
        </label>
        <label>
          <span>출처</span>
          <input className="editor-input" value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value })} />
        </label>
      </div>
    </EditorModal>
  );
}
