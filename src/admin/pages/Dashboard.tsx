import React, { useEffect, useState } from 'react';
import { CalendarDays, Image, Inbox, ScrollText, Users } from 'lucide-react';
import { countRows } from '../api';
import { Button, Card, PageHeader } from '../ui';
import { useInstall } from '../useInstall';

export default function Dashboard({ go, email }: { go: (p: string) => void; email: string }) {
  const [n, setN] = useState<Record<string, number>>({});
  const pwa = useInstall();
  useEffect(() => {
    (async () => {
      const get = (t: string, f?: (q: any) => any) => countRows(t, f).catch(() => 0);
      setN({
        unread: await get('contact_messages', q => q.eq('is_read', false)),
        events: await get('events', q => q.gte('event_date', new Date().toISOString().slice(0, 10))),
        gallery: await get('media_items'),
        sevas: await get('sevas', q => q.eq('is_active', true)),
        people: await get('committee_members', q => q.eq('is_active', true))
      });
    })();
  }, []);
  const tiles = [
    { id: 'inbox', label: 'New messages', v: n.unread, icon: Inbox, tone: 'text-saffron-600 bg-saffron-50' },
    { id: 'events', label: 'Upcoming events', v: n.events, icon: CalendarDays, tone: 'text-emerald-600 bg-emerald-50' },
    { id: 'gallery', label: 'Gallery items', v: n.gallery, icon: Image, tone: 'text-sky-600 bg-sky-50' },
    { id: 'sevas', label: 'Active sevas', v: n.sevas, icon: ScrollText, tone: 'text-amber-600 bg-amber-50' },
    { id: 'people', label: 'Trustees & priests', v: n.people, icon: Users, tone: 'text-violet-600 bg-violet-50' }
  ];
  const quick = [
    ['events', 'Add an event'], ['announcements', 'Post an announcement'], ['gallery', 'Upload photos'],
    ['settings', 'Change phone / WhatsApp'], ['seo', 'Check SEO score'], ['texts', 'Edit page texts']
  ];
  return (
    <div>
      <PageHeader title="Namaste 🙏" subtitle={`Signed in as ${email}. Everything you save here goes live on the website straight away.`} />
      {!pwa.installed && (
        <div className="mb-5 rounded-2xl border border-saffron-200 bg-saffron-50 p-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="text-sm text-stone-800">
            <b>Install this admin as an app</b>
            <div className="text-stone-600 mt-0.5">
              {pwa.canPrompt ? 'Opens full-screen from your home screen, like a normal app.'
                : pwa.isIOS ? 'On iPhone: tap the Share button in Safari, then “Add to Home Screen”.'
                : 'Use your browser menu (⋮) → “Install app” / “Add to Home screen”. It needs the live https:// site (or localhost) in Chrome, Edge or Safari.'}
            </div>
          </div>
          {pwa.canPrompt && <Button onClick={pwa.install}>Install app</Button>}
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {tiles.map(t => (
          <button key={t.id} onClick={() => go(t.id)} className="bg-white border border-stone-200 rounded-2xl p-4 text-left hover:shadow-md transition cursor-pointer">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${t.tone}`}><t.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold text-stone-900">{t.v ?? '–'}</div>
            <div className="text-xs text-stone-500 font-medium">{t.label}</div>
          </button>
        ))}
      </div>
      <Card title="Quick actions">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {quick.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="rounded-xl border border-stone-200 px-4 py-3 text-left text-sm font-semibold text-stone-800 hover:bg-saffron-50 hover:border-saffron-300 cursor-pointer min-h-[48px]">{label} →</button>
          ))}
        </div>
      </Card>
    </div>
  );
}
