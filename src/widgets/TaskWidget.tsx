import { useState } from 'react';
import WidgetCard from '../components/WidgetCard';
import type { TaskItem } from '../data/types';
import type { LoadStatus } from '../data/useDashboardData';
import TaskInlineEditor from '../editors/TaskInlineEditor';

interface TaskWidgetProps {
  tasks: TaskItem[];
  dataStatus: LoadStatus;
  onSave: (tasks: TaskItem[]) => Promise<void>;
}

export default function TaskWidget({ tasks, dataStatus, onSave }: TaskWidgetProps) {
  const [error, setError] = useState<string | null>(null);

  async function toggleTask(taskId: string) {
    const nextTasks = tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task));

    try {
      setError(null);
      await onSave(nextTasks);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '할 일을 저장하지 못했습니다.');
    }
  }

  async function saveTasks(nextTasks: TaskItem[]) {
    try {
      setError(null);
      await onSave(nextTasks);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '할 일을 저장하지 못했습니다.');
    }
  }

  return (
    <WidgetCard title="오늘 할 일" subtitle="체크, 제목 수정, 추가와 삭제">
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskInlineEditor
              task={task}
              disabled={dataStatus === 'saving'}
              onToggle={() => void toggleTask(task.id)}
              onRename={(title) => void saveTasks(tasks.map((item) => (item.id === task.id ? { ...item, title } : item)))}
              onDelete={() => void saveTasks(tasks.filter((item) => item.id !== task.id))}
            />
          </li>
        ))}
      </ul>
      <button
        className="secondary-button no-drag mt-3"
        type="button"
        onClick={() => void saveTasks([...tasks, { id: `task-${Date.now()}`, title: '새 할 일', done: false }])}
      >
        + 할 일 추가
      </button>
      {error ? <p className="mt-3 text-xs text-focus-rose">{error}</p> : null}
    </WidgetCard>
  );
}
