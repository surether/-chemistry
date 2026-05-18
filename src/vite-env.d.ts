/// <reference types="vite/client" />

import type { LinkItem } from './data/types';

declare global {
  interface Window {
    dashboardApi?: {
      readJson: (fileName: string) => Promise<unknown>;
      writeJson: (fileName: string, data: unknown) => Promise<void>;
      openTarget: (target: string, kind: LinkItem['kind']) => Promise<void>;
      onOpenSettings: (callback: () => void) => () => void;
    };
  }
}
