import { useEffect, useState } from 'react';

/** "Install app" support: Chrome/Edge/Android give a prompt event; iPhone Safari needs manual steps. */
export function useInstall() {
  const [evt, setEvt] = useState<any>(null);
  const [installed, setInstalled] = useState(
    typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true)
  );
  useEffect(() => {
    const before = (e: Event) => { e.preventDefault(); setEvt(e); };
    const done = () => { setInstalled(true); setEvt(null); };
    window.addEventListener('beforeinstallprompt', before);
    window.addEventListener('appinstalled', done);
    return () => { window.removeEventListener('beforeinstallprompt', before); window.removeEventListener('appinstalled', done); };
  }, []);
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const install = async () => { if (!evt) return; evt.prompt(); await evt.userChoice; setEvt(null); };
  return { installed, canPrompt: !!evt, isIOS, install };
}
