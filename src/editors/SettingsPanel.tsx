import { useEffect, useMemo, useState } from 'react';
import type { SettingsData } from '../data/types';

interface SettingsPanelProps {
  open: boolean;
  settings: SettingsData;
  onClose: () => void;
  onSave: (settings: SettingsData) => Promise<void>;
}

export default function SettingsPanel({ open, settings, onClose, onSave }: SettingsPanelProps) {
  const [draft, setDraft] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings]);

  useEffect(() => {
    if (open) {
      setDraft(settings);
      setError(null);
    }
  }, [open, settings]);

  if (!open) {
    return null;
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '설정을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  function requestClose() {
    if (dirty && !window.confirm('저장하지 않은 설정이 있습니다. 닫을까요?')) {
      return;
    }
    onClose();
  }

  return (
    <div className="settings-scrim no-drag" role="presentation" onMouseDown={requestClose}>
      <aside className="settings-panel no-drag" role="dialog" aria-modal="true" aria-label="설정" onMouseDown={(event) => event.stopPropagation()}>
        <header className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-chalk-100">설정</h2>
            <p className="mt-1 text-xs text-chalk-500">일부 창 설정은 재실행 후 완전히 반영됩니다.</p>
          </div>
          <button className="icon-button no-drag" type="button" onClick={requestClose} aria-label="닫기">
            ×
          </button>
        </header>

        <div className="editor-form">
          <label>
            <span>교사 표시명</span>
            <input className="editor-input" value={draft.teacherName} onChange={(event) => setDraft({ ...draft, teacherName: event.target.value })} />
          </label>
          <label>
            <span>학교명</span>
            <input className="editor-input" value={draft.schoolName} onChange={(event) => setDraft({ ...draft, schoolName: event.target.value })} />
          </label>
          <label>
            <span>학년</span>
            <input className="editor-input" value={draft.grade} onChange={(event) => setDraft({ ...draft, grade: event.target.value })} />
          </label>
          <label>
            <span>창 모드</span>
            <select className="editor-input" value={draft.windowMode} onChange={(event) => setDraft({ ...draft, windowMode: event.target.value as SettingsData['windowMode'] })}>
              <option value="widget">위젯형</option>
              <option value="normal">일반 창</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-chalk-300">
            <input className="h-4 w-4 accent-focus-teal" type="checkbox" checked={draft.privacyMode} onChange={(event) => setDraft({ ...draft, privacyMode: event.target.checked })} />
            개인정보 보호 문구 표시
          </label>
        </div>

        {error ? <p className="mt-4 rounded-xl bg-focus-rose/10 px-3 py-2 text-sm text-focus-rose">{error}</p> : null}

        <footer className="mt-6 flex justify-end gap-2 border-t border-white/8 pt-4">
          <button className="dock-button no-drag" type="button" onClick={requestClose} disabled={saving}>
            취소
          </button>
          <button className="primary-button no-drag" type="button" onClick={() => void save()} disabled={saving}>
            저장
          </button>
        </footer>
      </aside>
    </div>
  );
}
