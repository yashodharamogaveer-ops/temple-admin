import React from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { HeroSlide } from '../../lib/content';
import { useContent } from '../useContent';
import { BiText, Button, Card, Empty, ImageField, Loading, PageHeader, SaveBar, TextInput } from '../ui';

export default function HeroPage() {
  const c = useContent(['hero']);
  if (c.error) return <p className="text-red-700 text-sm">{c.error}</p>;
  if (!c.data) return <Loading />;
  const slides = c.data.hero.slides || [];
  const set = (s: HeroSlide[]) => c.update('hero', { slides: s });
  const patch = (i: number, p: Partial<HeroSlide>) => set(slides.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const move = (i: number, d: number) => {
    const a = [...slides]; const j = i + d; if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]]; set(a);
  };
  return (
    <div>
      <PageHeader title="Home banner slides" subtitle="The big sliding photos at the top of the home page. With no slides here, the three built-in photos are used."
        actions={<Button onClick={() => set([...slides, { image_url: '', caption_kn: '', caption_en: '' }])}><Plus className="w-4 h-4" /> Add slide</Button>} />
      <div className="space-y-4">
        {slides.length === 0 && <Card><Empty title="Using the built-in slides" hint="Add your own photos to replace them. Use wide (landscape) photos, at least 1600 px wide." /></Card>}
        {slides.map((s, i) => (
          <Card key={i} title={`Slide ${i + 1}`} actions={
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Up"><ArrowUp className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" disabled={i === slides.length - 1} onClick={() => move(i, 1)} aria-label="Down"><ArrowDown className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => set(slides.filter((_, j) => j !== i))} aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
            </div>}>
            <div className="space-y-4">
              <ImageField label="Photo" value={s.image_url} onChange={v => patch(i, { image_url: v })} folder="hero" maxDim={2200} />
              <BiText label="Caption" kn={s.caption_kn} en={s.caption_en} onKn={v => patch(i, { caption_kn: v })} onEn={v => patch(i, { caption_en: v })} />
            </div>
          </Card>
        ))}
        <Card title="Timing"><TextInput label="Seconds per slide" type="number" min={3} max={30} value={c.data.hero.interval_sec ?? 6} onChange={v => c.update('hero', { interval_sec: Number(v) })} /></Card>
      </div>
      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onReset={c.reset} />
    </div>
  );
}
