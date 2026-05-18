import { useEffect, useMemo, useState } from 'react';
import type { LinkItem } from '../data/types';
import EditorModal from './EditorModal';

interface LinksEditorProps {
  open: boolean;
  links: LinkItem[];
  onClose: () => void;
  onSave: (links: LinkItem[]) => Promise<void>;
}

export default function LinksEditor({ open, links, onClose, onSave }: LinksEditorProps) {
  const [draft, setDraft] = useState<LinkItem[]>(links);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(links), [draft, links]);

  useEffect(() => {
    if (open) {
      setDraft(links.map((item) => ({ ...item })));
      setError(null);
    }
  }, [open, links]);

  function updateItem(index: number, patch: Partial<LinkItem>) {
    setDraft((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  async function save() {
    const invalidUrl = draft.find((link) => link.kind === 'url' && !/^https?:\/\//i.test(link.target));
    if (invalidUrl) {
      setError(`"${invalidUrl.title || '이름 없는 링크'}"의 링크 주소는 http:// 또는 https://로 시작해야 합니다.`);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '링크를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorModal title="빠른 링크 편집" open={open} dirty={dirty} saving={saving} error={error} onClose={onClose} onSave={save}>
      <div className="space-y-3">
        {draft.map((link, index) => (
          <div key={`${link.title}-${index}`} className="editor-row grid grid-cols-[1fr_110px_1.5fr_1fr_auto] gap-2">
            <input className="editor-input" value={link.title} placeholder="제목" onChange={(event) => updateItem(index, { title: event.target.value })} />
            <select className="editor-input" value={link.kind} onChange={(event) => updateItem(index, { kind: event.target.value as LinkItem['kind'] })}>
              <option value="url">링크</option>
              <option value="path">폴더</option>
            </select>
            <input
              className="editor-input"
              value={link.target}
              placeholder={link.kind === 'url' ? '링크 주소' : '폴더 위치'}
              onChange={(event) => updateItem(index, { target: event.target.value })}
            />
            <input className="editor-input" value={link.category} placeholder="분류" onChange={(event) => updateItem(index, { category: event.target.value })} />
            <button className="danger-button no-drag" type="button" onClick={() => setDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
              삭제
            </button>
          </div>
        ))}
      </div>
      <button className="secondary-button no-drag mt-4" type="button" onClick={() => setDraft((current) => [...current, { title: '', kind: 'url', target: 'https://', category: 'school' }])}>
        링크 추가
      </button>
    </EditorModal>
  );
}
