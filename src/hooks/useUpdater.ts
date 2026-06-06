import { useState, useEffect, useCallback } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

// Global state for the updater
let state = {
  updateAvailable: false,
  updateInfo: null as { version: string; notes: string } | null,
  isDownloading: false,
  downloadProgress: 0,
  isDismissed: false,
};

const listeners = new Set<(s: typeof state) => void>();

function setState(nextState: Partial<typeof state>) {
  state = { ...state, ...nextState };
  listeners.forEach(l => l(state));
}

let globalUpdateCheckInterval: any = null;

async function runCheck(manual = false) {
  try {
    const update = await check();
    if (update?.available) {
      setState({
        updateAvailable: true,
        updateInfo: {
          version: update.version,
          notes: update.body ?? 'Bug fixes and improvements'
        },
        isDismissed: false
      });
    } else {
      setState({ updateAvailable: false });
      if (manual) {
        // Could trigger a notification "Latest version"
      }
    }
  } catch (e) {
    console.error('Update check failed:', e);
  }
}

export function useUpdater() {
  const [localState, setLocalState] = useState(state);

  useEffect(() => {
    listeners.add(setLocalState);
    if (!globalUpdateCheckInterval) {
      runCheck();
      globalUpdateCheckInterval = setInterval(() => runCheck(), 4 * 60 * 60 * 1000);
    }
    return () => {
      listeners.delete(setLocalState);
    };
  }, []);

  const installUpdate = useCallback(async () => {
    if (!state.updateAvailable) return;
    setState({ isDownloading: true });
    try {
      const update = await check();
      await update?.downloadAndInstall((event) => {
        if (event.event === 'Progress') {
          setState({ downloadProgress: Math.min(state.downloadProgress + 5, 95) });
        }
      });
      setState({ downloadProgress: 100 });
      await relaunch();
    } catch (e) {
      console.error('Update install failed:', e);
      setState({ isDownloading: false });
    }
  }, []);

  return {
    ...localState,
    installUpdate,
    checkForUpdates: () => runCheck(true),
    setIsDismissed: (isDismissed: boolean) => setState({ isDismissed })
  };
}
