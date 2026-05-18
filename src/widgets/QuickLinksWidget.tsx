import { useState } from 'react';
import WidgetCard from '../components/WidgetCard';
import type { LinkItem } from '../data/types';
import { openLinkTarget } from '../utils/safeOpen';

interface QuickLinksWidgetProps {
  links: LinkItem[];
  onEdit: () => void;
}

export default function QuickLinksWidget({ links, onEdit }: QuickLinksWidgetProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleOpen(link: LinkItem) {
    try {
      setError(null);
      await openLinkTarget(link);
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : '링크를 열지 못했습니다.');
    }
  }

  return (
    <WidgetCard title="자주 쓰는 링크" subtitle="자주 쓰는 주소와 폴더" editable onEdit={onEdit}>
      <div className="grid grid-cols-2 gap-2">
        {links.map((link) => (
          <button
            key={`${link.kind}-${link.title}`}
            className="link-button no-drag"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              void handleOpen(link);
            }}
          >
            <span className="block truncate text-sm font-semibold">{link.title}</span>
            <span className="mt-1 block text-[11px] text-chalk-500">{link.kind === 'url' ? '웹 링크' : '로컬 경로'}</span>
          </button>
        ))}
      </div>
      {error ? <p className="mt-3 text-xs text-focus-rose">{error}</p> : null}
    </WidgetCard>
  );
}
