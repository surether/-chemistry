import { openTarget } from '../data/dataClient';
import type { LinkItem } from '../data/types';

export async function openLinkTarget(link: LinkItem): Promise<void> {
  await openTarget(link.target, link.kind);
}
