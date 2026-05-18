import { useEffect, type ReactNode } from 'react';

interface EditorModalProps {
  title: string;
  open: boolean;
  dirty?: boolean;
  saving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave?: () => void | Promise<void>;
  children: ReactNode;
}

export default function EditorModal({ title, open, dirty = false, saving = false, error, onClose, onSave, children }: EditorModalProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, dirty]);

  function requestClose() {
    if (dirty && !window.confirm('저장하지 않은 변경사항이 있습니다. 닫을까요?')) {
      return;
    }
    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop no-drag" role="presentation" onMouseDown={requestClose}>
      <section
        className="modal-panel no-drag"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-chalk-100">{title}</h2>
            <p className="mt-1 text-xs text-chalk-500">수정 후 저장을 누르면 로컬 파일에 반영됩니다.</p>
          </div>
          <button className="icon-button no-drag" type="button" onClick={requestClose} aria-label="닫기">
            ×
          </button>
        </header>

        <div className="max-h-[64vh] overflow-y-auto pr-1">{children}</div>

        {error ? <p className="mt-4 rounded-xl bg-focus-rose/10 px-3 py-2 text-sm text-focus-rose">{error}</p> : null}

        <footer className="mt-5 flex items-center justify-end gap-2 border-t border-white/8 pt-4">
          <button className="dock-button no-drag" type="button" onClick={requestClose} disabled={saving}>
            취소
          </button>
          {onSave ? (
            <button className="primary-button no-drag" type="button" onClick={() => void onSave()} disabled={saving}>
              {saving ? '저장 중' : '저장'}
            </button>
          ) : null}
        </footer>
      </section>
    </div>
  );
}
