import React, { useMemo, useState } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { translations } from '../../types';
import { STRING_CATALOG } from '../../lib/stringCatalog';
import { Bilingual, flattenTexts } from '../../lib/content';
import { useContent } from '../useContent';
import { Button, Loading, PageHeader, SaveBar, Tabs, TextArea, cx } from '../ui';

// Managed in Site settings instead
const SKIP = [/^templeName$/, /^templeSub$/, /^contactSection\.(address|email|phones\.\d+)$/, /^footer\.rights$/];

interface Row { id: string; group: string; label: string; kn: string; en: string }

const pretty = (s: string) => s.replace(/([A-Z])/g, ' $1').replace(/\./g, ' › ').replace(/^./, c => c.toUpperCase());

function buildCore(): Row[] {
  const kn = flattenTexts(translations.kn), en = Object.fromEntries(flattenTexts(translations.en).map(x => [x.path, x.value]));
  return kn.filter(x => !SKIP.some(r => r.test(x.path))).map(x => ({
    id: x.path, group: x.path.split('.')[0], label: pretty(x.path), kn: x.value, en: en[x.path] ?? ''
  }));
}
const CORE = buildCore();
const CATALOG: Row[] = STRING_CATALOG.map(e => ({ id: e.id, group: e.section, label: e.en.slice(0, 60), kn: e.kn, en: e.en }));

export default function TextsPage() {
  const c = useContent(['core_texts', 'strings']);
  const [tab, setTab] = useState<'page' | 'main'>('page');
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('All');
  const [limit, setLimit] = useState(25);

  const rows = tab === 'main' ? CORE : CATALOG;
  const groups = useMemo(() => ['All', ...Array.from(new Set(rows.map(r => r.group)))], [rows]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter(r => (group === 'All' || r.group === group) && (!s || (r.kn + r.en + r.label).toLowerCase().includes(s)));
  }, [rows, q, group]);

  if (c.error) return <p className="text-red-700 text-sm">{c.error}</p>;
  if (!c.data) return <Loading />;
  const store = tab === 'main' ? c.data.core_texts : c.data.strings;
  const key = tab === 'main' ? 'core_texts' : 'strings';

  const setVal = (r: Row, lang: 'kn' | 'en', v: string) => {
    const cur: Bilingual = { ...(store[r.id] || {}) };
    if (v === r[lang]) delete cur[lang]; else cur[lang] = v;
    const next = { ...store };
    if (!cur.kn && !cur.en) delete next[r.id]; else next[r.id] = cur;
    c.replace(key, next as any);
  };
  const edited = (r: Row) => !!(store[r.id]?.kn || store[r.id]?.en);

  return (
    <div>
      <PageHeader title="Page texts" subtitle="Change any heading, button or sentence on the website, in Kannada and English. Edited texts are marked; “Reset” brings back the original." />
      <Tabs value={tab} onChange={t => { setTab(t); setGroup('All'); setLimit(25); }} tabs={[
        { id: 'page', label: `Page texts (${CATALOG.length})` }, { id: 'main', label: `Main texts (${CORE.length})` }
      ]} />
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input value={q} onChange={e => { setQ(e.target.value); setLimit(25); }} placeholder="Search any word in Kannada or English…"
          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500/40" />
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 [scrollbar-width:none]">
        {groups.map(g => (
          <button key={g} onClick={() => { setGroup(g); setLimit(25); }}
            className={cx('px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer', group === g ? 'bg-saffron-600 text-white' : 'bg-white border border-stone-200 text-stone-600')}>{g}</button>
        ))}
      </div>
      <p className="text-xs text-stone-500 mb-3">{filtered.length} texts. Name, address, phones, email and copyright are edited in <b>Site settings</b>.</p>

      <div className="space-y-3">
        {filtered.slice(0, limit).map(r => (
          <div key={r.id} className={cx('bg-white rounded-2xl border p-3.5', edited(r) ? 'border-amber-300 bg-amber-50/30' : 'border-stone-200')}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-stone-400 truncate">{r.group} · {r.label}</span>
              {edited(r) && <Button size="sm" variant="ghost" onClick={() => { const n = { ...store }; delete n[r.id]; c.replace(key, n as any); }}><RotateCcw className="w-3 h-3" /> Reset</Button>}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <TextArea value={store[r.id]?.kn ?? r.kn} onChange={v => setVal(r, 'kn', v)} rows={r.kn.length > 120 ? 4 : 2} />
              <TextArea value={store[r.id]?.en ?? r.en} onChange={v => setVal(r, 'en', v)} rows={r.en.length > 120 ? 4 : 2} />
            </div>
          </div>
        ))}
      </div>
      {filtered.length > limit && <div className="text-center mt-4"><Button variant="secondary" onClick={() => setLimit(l => l + 40)}>Show more</Button></div>}
      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onReset={c.reset} />
    </div>
  );
}
