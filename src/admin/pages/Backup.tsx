import React, { useRef, useState } from 'react';
import { Download, History, Upload } from 'lucide-react';
import { CONTENT_KEYS } from '../../lib/content';
import { errMsg, loadHistory, sb, saveContent } from '../api';
import { Button, Card, PageHeader, Select, useToast } from '../ui';

const TABLES = ['temple_profile', 'sevas', 'events', 'committee_members', 'announcements', 'notifications', 'about_features', 'temple_history', 'media_items', 'faqs', 'seo_pages'];

export default function BackupPage() {
  const { push } = useToast();
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState<string>('branding');
  const [hist, setHist] = useState<any[] | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const exportAll = async () => {
    setBusy(true);
    try {
      const out: any = { exported_at: new Date().toISOString(), site_content: {}, tables: {} };
      const { data } = await sb().from('site_content').select('key,value');
      (data || []).forEach((r: any) => { out.site_content[r.key] = r.value; });
      for (const t of TABLES) { const r = await sb().from(t).select('*'); out.tables[t] = r.data || []; }
      const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `temple-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
      push('ok', 'Backup downloaded');
    } catch (e) { push('err', errMsg(e)); } finally { setBusy(false); }
  };

  const importSettings = async (f?: File | null) => {
    if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      const sc = j.site_content || {};
      let n = 0;
      for (const k of Object.keys(sc)) { if (k.startsWith('private.')) continue; await saveContent(k, sc[k]); n++; }
      push('ok', `Restored ${n} settings groups. Reload the page to see them.`);
    } catch (e) { push('err', 'Invalid backup file: ' + errMsg(e)); } finally { if (file.current) file.current.value = ''; }
  };

  const showHist = async () => { try { setHist(await loadHistory(key)); } catch (e) { push('err', errMsg(e)); } };
  const restore = async (v: any) => { try { await saveContent(key, v.value); push('ok', 'Restored that version'); showHist(); } catch (e) { push('err', errMsg(e)); } };

  return (
    <div>
      <PageHeader title="Backup & history" subtitle="Download everything as one file, restore settings, or undo a change." />
      <div className="space-y-5">
        <Card title="Download backup" subtitle="All settings, sevas, events, trustees, gallery list, SEO and Q&A in one JSON file. Photos stay in storage.">
          <Button onClick={exportAll} loading={busy}><Download className="w-4 h-4" /> Download backup</Button>
        </Card>
        <Card title="Restore settings" subtitle="Restores site settings (not tables like sevas/events) from a backup file.">
          <input ref={file} type="file" accept="application/json" className="hidden" onChange={e => importSettings(e.target.files?.[0])} />
          <Button variant="secondary" onClick={() => file.current?.click()}><Upload className="w-4 h-4" /> Choose backup file</Button>
        </Card>
        <Card title="Undo a settings change" subtitle="The last 30 versions of each settings group are kept.">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-56"><Select label="Settings group" value={key} onChange={setKey} options={CONTENT_KEYS.map(k => ({ value: k, label: k }))} /></div>
            <Button variant="secondary" onClick={showHist}><History className="w-4 h-4" /> Show versions</Button>
          </div>
          {hist && (hist.length === 0 ? <p className="text-sm text-stone-500 mt-4">No older versions yet.</p> : (
            <ul className="mt-4 divide-y divide-stone-100">
              {hist.map(h => (
                <li key={h.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <span>{new Date(h.changed_at).toLocaleString('en-IN')}</span>
                  <Button size="sm" variant="secondary" onClick={() => restore(h)}>Restore</Button>
                </li>
              ))}
            </ul>
          ))}
        </Card>
      </div>
    </div>
  );
}
