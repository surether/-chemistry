import type { KeyboardEvent, ReactNode } from 'react';

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  editable?: boolean;
  editHint?: string;
  onEdit?: () => void;
}

export default function WidgetCard({
  title,
  subtitle,
  children,
  footer,
  className = '',
  editable = false,
  editHint = '클릭해서 수정',
  onEdit
}: WidgetCardProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!editable || !onEdit) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onEdit();
    }
  }

  return (
    <section
      className={`widget-card no-drag flex min-h-0 flex-col ${editable ? 'editable-card' : ''} ${className}`}
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      onClick={editable ? onEdit : undefined}
      onKeyDown={handleKeyDown}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold leading-tight text-chalk-100">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs leading-normal text-chalk-500">{subtitle}</p> : null}
        </div>
        {editable ? <span className="edit-hint">{editHint}</span> : null}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      {footer ? <footer className="mt-4 border-t border-white/7 pt-3 text-xs text-chalk-500">{footer}</footer> : null}
    </section>
  );
}
