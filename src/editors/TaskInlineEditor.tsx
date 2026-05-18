import { useEffect, useState } from 'react';
import type { TaskItem } from '../data/types';

interface TaskInlineEditorProps {
  task: TaskItem;
  disabled?: boolean;
  onToggle: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}

export default function TaskInlineEditor({ task, disabled = false, onToggle, onRename, onDelete }: TaskInlineEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  useEffect(() => {
    setDraft(task.title);
  }, [task.title]);

  function commit() {
    const nextTitle = draft.trim() || '새 할 일';
    setEditing(false);
    if (nextTitle !== task.title) {
      onRename(nextTitle);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2.5">
        <input className="editor-input flex-1" value={draft} autoFocus onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
          if (event.key === 'Escape') {
            setDraft(task.title);
            setEditing(false);
          }
        }} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5 transition hover:bg-white/8">
      <input className="h-4 w-4 accent-focus-teal" type="checkbox" checked={task.done} disabled={disabled} onChange={onToggle} />
      <button className={`min-w-0 flex-1 text-left text-sm ${task.done ? 'text-chalk-500 line-through' : 'text-chalk-300'}`} type="button" onClick={() => setEditing(true)}>
        {task.title}
      </button>
      <button className="icon-button no-drag" type="button" onClick={onDelete} aria-label="할 일 삭제">
        ×
      </button>
    </div>
  );
}
