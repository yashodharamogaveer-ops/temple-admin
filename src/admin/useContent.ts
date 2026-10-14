import { useCallback, useEffect, useRef, useState } from 'react';
import { SiteContent } from '../lib/content';
import { errMsg, loadAllContent, saveContent } from './api';
import { useToast } from './ui';

/**
 * Loads site_content, lets a page edit some keys, and saves only the keys that changed.
 * Warns before leaving the tab with unsaved edits.
 */
export function useContent(keys: (keyof SiteContent)[]) {
  const [data, setData] = useState<SiteContent | null>(null);
  const orig = useRef<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const { push } = useToast();

  const load = useCallback(async () => {
    try {
      const c = await loadAllContent();
      orig.current = Object.fromEntries(keys.map(k => [k, JSON.stringify(c[k])]));
      setData(c); setError(null);
    } catch (e) { setError(errMsg(e)); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(',')]);

  useEffect(() => { load(); }, [load]);

  const dirtyKeys = data ? keys.filter(k => JSON.stringify(data[k]) !== orig.current[k as string]) : [];
  const dirty = dirtyKeys.length > 0;

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const update = <K extends keyof SiteContent>(key: K, patch: Partial<SiteContent[K]>) =>
    setData(d => (d ? { ...d, [key]: { ...(d[key] as any), ...patch } } : d));

  const replace = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setData(d => (d ? { ...d, [key]: value } : d));

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      for (const k of dirtyKeys) {
        await saveContent(k as string, data[k]);
        orig.current[k as string] = JSON.stringify(data[k]);
      }
      setTick(t => t + 1);
      push('ok', 'Saved — live on the website');
    } catch (e) { push('err', errMsg(e)); } finally { setSaving(false); }
  };

  const reset = () => { load(); };
  return { data, update, replace, dirty, dirtyKeys, saving, save, reset, error, tick };
}
