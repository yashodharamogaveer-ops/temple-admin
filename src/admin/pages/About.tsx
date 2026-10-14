import React, { useEffect, useState } from 'react';
import { errMsg, sb, saveRow } from '../api';
import { BiText, Card, ImageField, Loading, PageHeader, SaveBar, useToast } from '../ui';
import { CrudPage } from './Crud';
import { aboutFeaturesCfg, historyCfg } from './cruds';
import { Tabs } from '../ui';

const FIELDS = ['about_title_kn', 'about_title_en', 'about_intro_kn', 'about_intro_en', 'about_description1_kn', 'about_description1_en',
  'about_description2_kn', 'about_description2_en', 'about_image_url', 'about_image_caption_kn', 'about_image_caption_en'];

function Profile() {
  const [row, setRow] = useState<any | null>(null);
  const [orig, setOrig] = useState('');
  const [saving, setSaving] = useState(false);
  const { push } = useToast();
  useEffect(() => {
    sb().from('temple_profile').select('*').limit(1).maybeSingle().then(({ data, error }) => {
      if (error) { push('err', errMsg(error)); return; }
      const r = data || {}; setRow(r); setOrig(JSON.stringify(r));
    });
    // eslint-disable-next-line
  }, []);
  if (!row) return <Loading />;
  const set = (p: any) => setRow((r: any) => ({ ...r, ...p }));
  const save = async () => {
    setSaving(true);
    try {
      const payload: any = { ...(row.id ? { id: row.id } : {}) };
      FIELDS.forEach(f => { payload[f] = row[f] ?? null; });
      await saveRow('temple_profile', payload);
      const { data } = await sb().from('temple_profile').select('*').limit(1).maybeSingle();
      setRow(data); setOrig(JSON.stringify(data)); push('ok', 'Saved — live on the website');
    } catch (e) { push('err', errMsg(e)); } finally { setSaving(false); }
  };
  return (
    <div className="space-y-5">
      <Card title="About page — main story" subtitle="If left empty, the built-in text is shown.">
        <div className="space-y-4">
          <BiText label="Page heading" kn={row.about_title_kn} en={row.about_title_en} onKn={v => set({ about_title_kn: v })} onEn={v => set({ about_title_en: v })} />
          <BiText label="Introduction" multiline rows={3} kn={row.about_intro_kn} en={row.about_intro_en} onKn={v => set({ about_intro_kn: v })} onEn={v => set({ about_intro_en: v })} />
          <BiText label="Paragraph 1" multiline rows={5} kn={row.about_description1_kn} en={row.about_description1_en} onKn={v => set({ about_description1_kn: v })} onEn={v => set({ about_description1_en: v })} />
          <BiText label="Paragraph 2" multiline rows={5} kn={row.about_description2_kn} en={row.about_description2_en} onKn={v => set({ about_description2_kn: v })} onEn={v => set({ about_description2_en: v })} />
          <ImageField label="Photo" value={row.about_image_url} onChange={v => set({ about_image_url: v })} folder="about" maxDim={1600} />
          <BiText label="Photo caption" kn={row.about_image_caption_kn} en={row.about_image_caption_en} onKn={v => set({ about_image_caption_kn: v })} onEn={v => set({ about_image_caption_en: v })} />
        </div>
      </Card>
      <SaveBar dirty={JSON.stringify(row) !== orig} saving={saving} onSave={save} onReset={() => setRow(JSON.parse(orig))} />
    </div>
  );
}

export default function AboutPage() {
  const [tab, setTab] = useState<'story' | 'history' | 'features'>('story');
  return (
    <div>
      <PageHeader title="About the temple" subtitle="Story, history and highlights shown on the About page and home page." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'story', label: 'Main story' }, { id: 'history', label: 'History' }, { id: 'features', label: 'Highlights' }]} />
      {tab === 'story' && <Profile />}
      {tab === 'history' && <CrudPage cfg={historyCfg} />}
      {tab === 'features' && <CrudPage cfg={aboutFeaturesCfg} />}
    </div>
  );
}
