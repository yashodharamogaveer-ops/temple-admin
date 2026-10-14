import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Rocket } from 'lucide-react';
import { SeoPageRow } from '../../lib/content';
import { INDEXABLE_PAGES, PAGE_LABELS, PAGE_PATHS, SeoPageKey, siteUrlOf } from '../../lib/seo';
import { countRows, errMsg, loadPrivate, saveContent, sb, triggerRebuild } from '../api';
import { useContent } from '../useContent';
import { BiText, Button, Card, ImageField, Loading, PageHeader, SaveBar, Tabs, TextArea, TextInput, Toggle, useToast, cx } from '../ui';
import { CrudPage } from './Crud';
import { faqCfg } from './cruds';

type Tab = 'health' | 'pages' | 'site' | 'engines' | 'ai' | 'publish';

/* ---------- per-page ---------- */
function PagesTab() {
  const [rows, setRows] = useState<Record<string, SeoPageRow> | null>(null);
  const [orig, setOrig] = useState('');
  const [page, setPage] = useState<SeoPageKey>('home');
  const [lang, setLang] = useState<'kn' | 'en'>('en');
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    sb().from('seo_pages').select('*').then(({ data, error }) => {
      if (error) { push('err', errMsg(error)); setRows({}); return; }
      const m: Record<string, SeoPageRow> = {};
      (data || []).forEach((r: any) => { m[r.page_key] = r; });
      setRows(m); setOrig(JSON.stringify(m));
    });
    // eslint-disable-next-line
  }, []);
  if (!rows) return <Loading />;

  const row: any = rows[page] || { page_key: page };
  const set = (p: any) => setRows({ ...rows, [page]: { ...row, ...p } });
  const t = row[`title_${lang}`] || '', d = row[`description_${lang}`] || '';
  const save = async () => {
    setSaving(true);
    try {
      const out = Object.values(rows).map((r: any) => ({ ...r, updated_at: new Date().toISOString() }));
      const { error } = await sb().from('seo_pages').upsert(out, { onConflict: 'page_key' });
      if (error) throw error;
      setOrig(JSON.stringify(rows)); push('ok', 'Saved — live on the website');
    } catch (e) { push('err', errMsg(e)); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <Tabs value={page} onChange={setPage} tabs={INDEXABLE_PAGES.map(p => ({ id: p, label: PAGE_LABELS[p].en }))} />
      <Card title={`${PAGE_LABELS[page].en} page`} subtitle={`Address: ${PAGE_PATHS[page]}. Empty fields use the built-in text.`}>
        <div className="flex gap-2 mb-4">
          {(['en', 'kn'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} className={cx('px-3.5 py-1.5 rounded-full text-sm font-bold cursor-pointer', lang === l ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600')}>{l === 'en' ? 'English' : 'ಕನ್ನಡ'}</button>
          ))}
        </div>
        <div className="space-y-4">
          <TextInput label="Page title" value={t} onChange={v => set({ [`title_${lang}`]: v })} placeholder="Shown as the blue link in Google"
            help={`${t.length} characters — best between 30 and 60.`} />
          <TextArea label="Description" rows={3} value={d} onChange={v => set({ [`description_${lang}`]: v })} showCount maxLength={160}
            help="Shown under the title in Google. Best between 70 and 160 characters." />
          <TextInput label="Keywords (comma separated)" value={row[`keywords_${lang}`] || ''} onChange={v => set({ [`keywords_${lang}`]: v })} />
          <ImageField label="Share image for this page" folder="seo" maxDim={1600} value={row.og_image_url} onChange={v => set({ og_image_url: v })} help="1200×630. Empty = site-wide share image." />
          <Toggle label="Hide this page from Google" help="Adds “noindex”. Normally leave off." checked={!!row.noindex} onChange={v => set({ noindex: v })} />
        </div>
        <div className="mt-5 rounded-xl border border-stone-200 p-4 bg-white">
          <div className="text-[11px] font-bold uppercase text-stone-400 mb-2">Google preview</div>
          <div className="text-xs text-stone-600 truncate">haadikereshaneshwara.com › {PAGE_PATHS[page].replace('/', '') || 'home'}</div>
          <div className="text-[19px] leading-snug text-[#1a0dab] truncate">{t || 'Built-in title'}</div>
          <div className="text-sm text-stone-600 line-clamp-2">{d || 'Built-in description'}</div>
        </div>
      </Card>
      <SaveBar dirty={JSON.stringify(rows) !== orig} saving={saving} onSave={save} onReset={() => setRows(JSON.parse(orig))} />
    </div>
  );
}

/* ---------- main ---------- */
export default function SeoPage() {
  const c = useContent(['seo', 'integrations', 'branding', 'contact', 'social', 'timings']);
  const [tab, setTab] = useState<Tab>('health');
  const [faqCount, setFaqCount] = useState(0);
  const [hook, setHook] = useState('');
  const [hookOrig, setHookOrig] = useState('');
  const [building, setBuilding] = useState(false);
  const { push } = useToast();

  useEffect(() => {
    countRows('faqs').then(setFaqCount).catch(() => {});
    loadPrivate<{ hook_url?: string }>('private.deploy').then(v => { setHook(v?.hook_url || ''); setHookOrig(v?.hook_url || ''); }).catch(() => {});
  }, [tab]);

  if (c.error) return <p className="text-red-700 text-sm">{c.error}</p>;
  if (!c.data) return <Loading />;
  const d = c.data, site = siteUrlOf(d);

  const checks: { ok: boolean; label: string; tip: string }[] = [
    { ok: /^https:\/\//.test(d.seo.site_url || ''), label: 'Website address (https) set', tip: 'SEO → Site → Website address' },
    { ok: !!d.branding.og_image_url, label: 'Share image uploaded', tip: 'Site settings → Logo & name' },
    { ok: !!d.branding.favicon_url, label: 'Browser icon uploaded', tip: 'Site settings → Logo & name' },
    { ok: !!(d.contact.address_en || d.contact.address_kn), label: 'Address filled in', tip: 'Site settings → Contact' },
    { ok: !!(d.contact.phones || []).filter(Boolean).length, label: 'Phone number added', tip: 'Site settings → Contact' },
    { ok: !!(d.contact.latitude && d.contact.longitude), label: 'Map location (latitude / longitude)', tip: 'Site settings → Contact' },
    { ok: (d.timings.schedule || []).some(r => r.days.length), label: 'Opening hours for Google', tip: 'Site settings → Timings' },
    { ok: !!(d.social.instagram || d.social.facebook || d.social.youtube || d.seo.google_business_url), label: 'Social / Google Business profile linked', tip: 'Site settings → Social' },
    { ok: !!(d.seo.ai_summary_en || d.seo.ai_summary_kn), label: 'AI summary written', tip: 'SEO → AI & Q&A' },
    { ok: faqCount >= 3, label: `At least 3 Q&A for AI assistants (${faqCount})`, tip: 'SEO → AI & Q&A' },
    { ok: !!d.integrations.google_site_verification, label: 'Google Search Console verified', tip: 'SEO → Search engines' },
    { ok: !!(d.integrations.ga4_id || d.integrations.gtm_id), label: 'Visitor analytics connected', tip: 'SEO → Search engines' }
  ];
  const score = Math.round((checks.filter(x => x.ok).length / checks.length) * 100);

  const saveHook = async () => { try { await saveContent('private.deploy', { hook_url: hook }, false); setHookOrig(hook); push('ok', 'Saved'); } catch (e) { push('err', errMsg(e)); } };
  const rebuild = async () => {
    setBuilding(true);
    try { await triggerRebuild(hook); push('ok', 'Rebuild requested. Updated search pages go live in 1–3 minutes.'); } catch (e) { push('err', errMsg(e)); } finally { setBuilding(false); }
  };

  return (
    <div>
      <PageHeader title="SEO & AI search" subtitle="Help Google, Bing and AI assistants (ChatGPT, Gemini, Perplexity, Claude) find and describe the temple correctly." />
      <Tabs value={tab} onChange={setTab} tabs={[
        { id: 'health', label: 'Checklist' }, { id: 'pages', label: 'Page titles' }, { id: 'site', label: 'Site' },
        { id: 'engines', label: 'Search engines' }, { id: 'ai', label: 'AI & Q&A' }, { id: 'publish', label: 'Publish' }
      ]} />

      {tab === 'health' && (
        <Card title={`SEO score: ${score}%`} subtitle="Complete the items below for the best results.">
          <div className="h-2.5 rounded-full bg-stone-100 mb-5 overflow-hidden"><div className={cx('h-full', score > 75 ? 'bg-emerald-500' : score > 45 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: score + '%' }} /></div>
          <ul className="space-y-2.5">
            {checks.map((x, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                {x.ok ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <Circle className="w-5 h-5 text-stone-300 shrink-0" />}
                <div><div className={x.ok ? 'text-stone-700' : 'font-semibold text-stone-900'}>{x.label}</div>{!x.ok && <div className="text-xs text-stone-500">{x.tip}</div>}</div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-stone-500 mt-5">Already automatic: structured data for Google (HinduTemple, events, opening hours, breadcrumbs), canonical links, Open Graph share cards, sitemap.xml, robots.txt and llms.txt for AI crawlers.</p>
        </Card>
      )}

      {tab === 'pages' && <PagesTab />}

      {tab === 'site' && (
        <div className="space-y-5">
          <Card title="Website identity">
            <div className="space-y-4">
              <TextInput label="Website address" type="url" value={d.seo.site_url} onChange={v => c.update('seo', { site_url: v.replace(/\/+$/, '') })} help="Your real domain, e.g. https://www.haadikereshaneshwara.com" />
              <BiText label="Name used in search results" kn={d.seo.site_name_kn} en={d.seo.site_name_en} onKn={v => c.update('seo', { site_name_kn: v })} onEn={v => c.update('seo', { site_name_en: v })} />
              <BiText label="Default keywords" kn={d.seo.default_keywords_kn} en={d.seo.default_keywords_en} onKn={v => c.update('seo', { default_keywords_kn: v })} onEn={v => c.update('seo', { default_keywords_en: v })} />
              <div className="grid grid-cols-2 gap-3">
                <TextInput label="Temple founded (year)" value={d.seo.founding_year} onChange={v => c.update('seo', { founding_year: v })} />
                <TextInput label="Twitter / X handle" value={d.seo.twitter_handle} onChange={v => c.update('seo', { twitter_handle: v })} />
              </div>
              <TextInput label="Google Business Profile link" type="url" value={d.seo.google_business_url} onChange={v => c.update('seo', { google_business_url: v })} help="Strongly recommended: claim the temple on Google Maps and paste the link." />
              <TextArea label="Other official pages (one link per line)" rows={3} value={(d.seo.same_as || []).join('\n')} onChange={v => c.update('seo', { same_as: v.split('\n').map(x => x.trim()).filter(Boolean) })} help="Wikipedia, Wikidata, Justdial, TripAdvisor… helps Google and AI know it is the same temple." />
            </div>
          </Card>
        </div>
      )}

      {tab === 'engines' && (
        <Card title="Search engines & analytics" subtitle="Paste only the codes — no scripts needed.">
          <div className="space-y-4">
            <TextInput label="Google Search Console verification code" value={d.integrations.google_site_verification} onChange={v => c.update('integrations', { google_site_verification: v.trim() })} help="From Search Console → Settings → Ownership verification → HTML tag. Paste only the content=“…” value." />
            <TextInput label="Bing Webmaster verification code" value={d.integrations.bing_site_verification} onChange={v => c.update('integrations', { bing_site_verification: v.trim() })} />
            <TextInput label="Google Analytics 4 ID" placeholder="G-XXXXXXXXXX" value={d.integrations.ga4_id} onChange={v => c.update('integrations', { ga4_id: v.trim() })} />
            <TextInput label="Google Tag Manager ID (optional)" placeholder="GTM-XXXXXX" value={d.integrations.gtm_id} onChange={v => c.update('integrations', { gtm_id: v.trim() })} help="If set, it is used instead of the GA4 ID above." />
            <p className="text-xs text-stone-500">After verifying, submit <b>{site}/sitemap.xml</b> in Search Console and Bing Webmaster.</p>
          </div>
        </Card>
      )}

      {tab === 'ai' && (
        <div className="space-y-5">
          <Card title="AI summary" subtitle={`Published at ${site}/llms.txt — the file AI assistants read to understand the site.`}>
            <div className="space-y-4">
              <BiText label="Who we are, in 3–5 sentences" multiline rows={5} kn={d.seo.ai_summary_kn} en={d.seo.ai_summary_en} onKn={v => c.update('seo', { ai_summary_kn: v })} onEn={v => c.update('seo', { ai_summary_en: v })}
                help="Plain facts: what the temple is, where, timings, special days, free food (annadasoha), how to reach." />
              <Toggle label="Allow AI crawlers" help="GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc. Keep ON so AI assistants can recommend the temple." checked={d.seo.allow_ai_crawlers !== false} onChange={v => c.update('seo', { allow_ai_crawlers: v })} />
            </div>
          </Card>
          <CrudPage cfg={faqCfg} />
        </div>
      )}

      {tab === 'publish' && (
        <div className="space-y-5">
          <Card title="Refresh search pages" subtitle="Content changes are live instantly for visitors. The pre-built pages that search engines & AI bots read (sitemap, llms.txt, page snapshots) refresh when the site is rebuilt.">
            <div className="space-y-4">
              <TextInput label="Deploy hook URL" type="url" value={hook} onChange={setHook} placeholder="https://api.vercel.com/v1/integrations/deploy/…"
                help="Vercel: Project → Settings → Git → Deploy Hooks. Netlify: Site settings → Build & deploy → Build hooks. Cloudflare Pages: Settings → Builds → Deploy hooks." />
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={saveHook} disabled={hook === hookOrig}>Save hook</Button>
                <Button onClick={rebuild} loading={building} disabled={!hook}><Rocket className="w-4 h-4" /> Rebuild now</Button>
              </div>
            </div>
          </Card>
          <Card title="Your SEO files">
            <ul className="text-sm space-y-1.5">
              {['sitemap.xml', 'robots.txt', 'llms.txt'].map(f => <li key={f}><a className="text-saffron-700 font-semibold underline" href={`${site}/${f}`} target="_blank" rel="noopener noreferrer">{site}/{f}</a></li>)}
            </ul>
          </Card>
        </div>
      )}

      {['health', 'site', 'engines', 'ai'].includes(tab) && tab !== 'health' && tab !== 'ai' && <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onReset={c.reset} />}
      {tab === 'ai' && <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onReset={c.reset} note="AI summary" />}
    </div>
  );
}
