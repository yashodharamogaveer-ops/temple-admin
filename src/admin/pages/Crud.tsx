import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Search } from 'lucide-react';
import { deleteRow, errMsg, listRows, saveRow } from '../api';
import { Badge, BiText, Button, Card, ConfirmButton, Empty, ImageField, Loading, Modal, PageHeader, Select, TextArea, TextInput, Toggle, useToast, cx } from '../ui';

/** One editable field of a table row. `kn`/`en` pairs are rendered side by side. */
export type FieldDef =
  | { type: 'bi'; label: string; kn: string; en: string; multiline?: boolean; rows?: number; help?: string }
  | { type: 'text' | 'textarea' | 'number' | 'date' | 'time' | 'tel' | 'email' | 'url'; name: string; label: string; help?: string; placeholder?: string; rows?: number }
  | { type: 'image'; name: string; label: string; folder: string; help?: string; round?: boolean; maxDim?: number }
  | { type: 'toggle'; name: string; label: string; help?: string }
  | { type: 'select'; name: string; label: string; options: { value: string; label: string }[] };

export interface CrudConfig {
  title: string;
  subtitle?: string;
  table: string;
  addLabel: string;
  order: { col: string; asc?: boolean };
  /** column used for manual ordering with the ↑ ↓ buttons */
  sortColumn?: string;
  /** boolean column shown as a Show/Hide switch */
  activeColumn?: string;
  defaults: Record<string, any>;
  fields: FieldDef[];
  rowTitle: (r: any) => string;
  rowSub?: (r: any) => string | undefined;
  rowImage?: (r: any) => string | undefined;
  rowBadges?: (r: any) => { text: string; tone?: 'stone' | 'green' | 'amber' | 'red' | 'blue' }[];
  required?: string[];
  emptyHint?: string;
  /** optional hook to normalise a row before saving */
  beforeSave?: (r: any) => any;
}

export function CrudPage({ cfg }: { cfg: CrudConfig }) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const { push } = useToast();

  const load = useCallback(async () => {
    try { setRows(await listRows(cfg.table, cfg.order)); setError(null); }
    catch (e) { setError(errMsg(e)); setRows([]); }
  }, [cfg.table, cfg.order.col, cfg.order.asc]);

  useEffect(() => { setRows(null); load(); }, [load]);

  const shown = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, query]);

  const save = async () => {
    if (!editing) return;
    for (const f of cfg.required || []) {
      if (!String(editing[f] ?? '').trim()) { push('err', `Please fill in: ${f.replace(/_/g, ' ')}`); return; }
    }
    setSaving(true);
    try {
      let row = { ...editing };
      if (cfg.sortColumn && (row[cfg.sortColumn] === undefined || row[cfg.sortColumn] === null)) {
        row[cfg.sortColumn] = (rows || []).reduce((m, r) => Math.max(m, Number(r[cfg.sortColumn!]) || 0), 0) + 1;
      }
      if (cfg.beforeSave) row = cfg.beforeSave(row);
      await saveRow(cfg.table, row);
      push('ok', 'Saved — live on the website');
      setEditing(null);
      await load();
    } catch (e) { push('err', errMsg(e)); } finally { setSaving(false); }
  };

  const toggleActive = async (r: any) => {
    if (!cfg.activeColumn) return;
    try { await saveRow(cfg.table, { id: r.id, [cfg.activeColumn]: !(r[cfg.activeColumn] !== false) }); await load(); }
    catch (e) { push('err', errMsg(e)); }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    if (!cfg.sortColumn || !rows) return;
    const a = shown[idx], b = shown[idx + dir];
    if (!a || !b) return;
    // renumber the whole list so ties / nulls never block reordering
    const ordered = [...rows];
    const ia = ordered.findIndex(x => x.id === a.id), ib = ordered.findIndex(x => x.id === b.id);
    [ordered[ia], ordered[ib]] = [ordered[ib], ordered[ia]];
    try {
      await Promise.all(ordered.map((r, i) => (Number(r[cfg.sortColumn!]) === i + 1) ? null : saveRow(cfg.table, { id: r.id, [cfg.sortColumn!]: i + 1 })));
      await load();
    } catch (e) { push('err', errMsg(e)); }
  };

  const set = (patch: Record<string, any>) => setEditing((p: any) => ({ ...p, ...patch }));

  const renderField = (f: FieldDef, i: number) => {
    switch (f.type) {
      case 'bi':
        return <BiText key={i} label={f.label} kn={editing[f.kn]} en={editing[f.en]} onKn={v => set({ [f.kn]: v })} onEn={v => set({ [f.en]: v })} multiline={f.multiline} rows={f.rows} help={f.help} />;
      case 'textarea':
        return <TextArea key={i} label={f.label} help={f.help} value={editing[f.name]} onChange={v => set({ [f.name]: v })} rows={f.rows || 4} placeholder={f.placeholder} />;
      case 'image':
        return <ImageField key={i} label={f.label} help={f.help} folder={f.folder} value={editing[f.name]} onChange={v => set({ [f.name]: v })} round={f.round} maxDim={f.maxDim} />;
      case 'toggle':
        return <Toggle key={i} label={f.label} help={f.help} checked={editing[f.name] !== false && !!(editing[f.name] ?? true)} onChange={v => set({ [f.name]: v })} />;
      case 'select':
        return <Select key={i} label={f.label} value={editing[f.name]} onChange={v => set({ [f.name]: v })} options={f.options} />;
      default:
        return <TextInput key={i} label={f.label} help={f.help} type={f.type} placeholder={f.placeholder} value={editing[f.name] ?? ''}
          onChange={v => set({ [f.name]: f.type === 'number' ? (v === '' ? null : Number(v)) : v })} />;
    }
  };

  return (
    <div>
      <PageHeader title={cfg.title} subtitle={cfg.subtitle}
        actions={<Button onClick={() => setEditing({ ...cfg.defaults })}><Plus className="w-4 h-4" /> {cfg.addLabel}</Button>} />

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-sm p-3.5">
          Could not load <b>{cfg.table}</b>: {error}. Have you run <code>supabase/001_cms_backend.sql</code>?
        </div>
      )}

      {rows && rows.length > 6 && (
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/40" />
        </div>
      )}

      {rows === null ? <Loading /> : shown.length === 0 ? (
        <Card><Empty title={query ? 'No matches' : `No ${cfg.title.toLowerCase()} yet`} hint={cfg.emptyHint}
          action={!query && <Button onClick={() => setEditing({ ...cfg.defaults })}><Plus className="w-4 h-4" /> {cfg.addLabel}</Button>} /></Card>
      ) : (
        <ul className="space-y-3">
          {shown.map((r, idx) => {
            const active = cfg.activeColumn ? r[cfg.activeColumn] !== false : true;
            const img = cfg.rowImage?.(r);
            return (
              <li key={r.id} className={cx('bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 flex gap-3 sm:gap-4 items-start', !active && 'opacity-60')}>
                {cfg.rowImage && (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    {img && (/\.(mp4|webm)(\?|$)/i.test(img) ? <video src={img} className="w-full h-full object-cover" muted /> : <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-900 leading-snug break-words">{cfg.rowTitle(r) || <span className="text-stone-400">(untitled)</span>}</div>
                  {cfg.rowSub?.(r) && <div className="text-sm text-stone-500 mt-0.5 line-clamp-2 break-words">{cfg.rowSub(r)}</div>}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {cfg.activeColumn && <Badge tone={active ? 'green' : 'stone'}>{active ? 'Visible' : 'Hidden'}</Badge>}
                    {cfg.rowBadges?.(r).map((b, i) => <Badge key={i} tone={b.tone}>{b.text}</Badge>)}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <Button size="sm" variant="secondary" onClick={() => setEditing({ ...r })}><Pencil className="w-3.5 h-3.5" /> Edit</Button>
                    {cfg.activeColumn && <Button size="sm" variant="ghost" onClick={() => toggleActive(r)}>{active ? 'Hide' : 'Show'}</Button>}
                    {cfg.sortColumn && !query && (
                      <>
                        <Button size="sm" variant="ghost" disabled={idx === 0} onClick={() => move(idx, -1)} aria-label="Move up"><ArrowUp className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" disabled={idx === shown.length - 1} onClick={() => move(idx, 1)} aria-label="Move down"><ArrowDown className="w-4 h-4" /></Button>
                      </>
                    )}
                    <ConfirmButton onConfirm={async () => { try { await deleteRow(cfg.table, r.id); push('ok', 'Deleted'); await load(); } catch (e) { push('err', errMsg(e)); } }} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={!!editing} wide title={editing?.id ? 'Edit' : cfg.addLabel} onClose={() => setEditing(null)}
        footer={<><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} loading={saving}>Save</Button></>}>
        {editing && <div className="space-y-5">{cfg.fields.map(renderField)}</div>}
      </Modal>
    </div>
  );
}
