import { useEffect, useRef, useState } from 'react';
import type { MemoData } from '../data/types';
import type { LoadStatus } from '../data/useDashboardData';

interface MemoInlineEditorProps {
  memo: MemoData;
  dataStatus: LoadStatus;
  onSave: (memo: MemoData) => Promise<void>;
}

export default function MemoInlineEditor({ memo, dataStatus, onSave }: MemoInlineEditorProps) {
  const [draft, setDraft] = useState(memo.content);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(memo.content);
  }, [memo.content]);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
    }
  }, [editing]);

  async function saveMemo() {
    try {
      setError(null);
      await onSave({ content: draft });
      setEditing(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '메모를 저장하지 못했습니다.');
    }
  }

  return (
    <div onClick={() => setEditing(true)}>
      <textarea
        ref={textareaRef}
        className="min-h-[132px] w-full resize-none rounded-2xl border border-white/8 bg-black/20 p-3 text-sm leading-6 text-chalk-300 outline-none transition placeholder:text-chalk-500 focus:border-focus-teal/60"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && event.ctrlKey) {
            void saveMemo();
          }
          if (event.key === 'Escape') {
            setDraft(memo.content);
            setEditing(false);
          }
        }}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] text-focus-gold">학생 이름, 성적, 상담 내용 등 개인정보는 입력하지 마세요.</p>
        <button className="primary-button no-drag" type="button" disabled={dataStatus === 'saving'} onClick={(event) => {
          event.stopPropagation();
          void saveMemo();
        }}>
          저장
        </button>
      </div>
      {editing ? <p className="mt-2 text-[11px] text-chalk-500">Ctrl+Enter 저장 · Esc 취소</p> : null}
      {error ? <p className="mt-3 text-xs text-focus-rose">{error}</p> : null}
    </div>
  );
}
