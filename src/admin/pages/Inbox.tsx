import React, { useCallback, useEffect, useState } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { buildWhatsAppLink } from '../../lib/content';
import { deleteRow, errMsg, listRows, saveRow } from '../api';
import { Badge, Button, Card, ConfirmButton, Empty, Loading, PageHeader, Tabs, useToast, cx } from '../ui';

const fmt = (s?: string) => (s ? new Date(s).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '');

export default function InboxPage() {
  const [tab, setTab] = useState<'messages' | 'sankalpa'>('messages');
  const [rows, setRows] = useState<any[] | null>(null);
  const { push } = useToast();
  const table = tab === 'messages' ? 'contact_messages' : 'seva_bookings';

  const load = useCallback(async () => {
    setRows(null);
    try { setRows(await listRows(table, { col: 'created_at', asc: false }, 300)); } catch (e) { push('err', errMsg(e)); setRows([]); }
  }, [table]);
  useEffect(() => { load(); }, [load]);

  const mark = async (r: any, read: boolean) => { await saveRow('contact_messages', { id: r.id, is_read: read }); load(); };

  return (
    <div>
      <PageHeader title="Inbox" subtitle="Messages sent from the website’s contact form." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'messages', label: 'Messages' }, { id: 'sankalpa', label: 'Sankalpa requests' }]} />
      {rows === null ? <Loading /> : rows.length === 0 ? <Card><Empty icon={<Mail className="w-6 h-6" />} title="Nothing here yet" /></Card> : (
        <ul className="space-y-3">
          {rows.map(r => tab === 'messages' ? (
            <li key={r.id} className={cx('bg-white rounded-2xl border p-4', r.is_read ? 'border-stone-200' : 'border-saffron-300 bg-saffron-50/30')}>
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-stone-900">{r.name} {!r.is_read && <Badge tone="amber">New</Badge>}</div>
                <span className="text-xs text-stone-500 shrink-0">{fmt(r.created_at)}</span>
              </div>
              <p className="mt-2 text-stone-700 whitespace-pre-wrap break-words text-[15px]">{r.message}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {r.phone && <a className="inline-flex" href={`tel:${r.phone}`}><Button size="sm" variant="secondary"><Phone className="w-3.5 h-3.5" /> {r.phone}</Button></a>}
                {r.phone && buildWhatsAppLink(r.phone) && <a href={buildWhatsAppLink(r.phone)} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="secondary"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</Button></a>}
                {r.email && <a href={`mailto:${r.email}`}><Button size="sm" variant="secondary"><Mail className="w-3.5 h-3.5" /> {r.email}</Button></a>}
                <Button size="sm" variant="ghost" onClick={() => mark(r, !r.is_read)}>{r.is_read ? 'Mark unread' : 'Mark read'}</Button>
                <ConfirmButton onConfirm={async () => { await deleteRow(table, r.id); load(); }} />
              </div>
            </li>
          ) : (
            <li key={r.id} className="bg-white rounded-2xl border border-stone-200 p-4">
              <div className="flex justify-between gap-2"><b>{r.devotee_name}</b><span className="text-xs text-stone-500">{fmt(r.created_at)}</span></div>
              <p className="text-sm text-stone-600 mt-1">Gotra: {r.gotra || '—'} · Nakshatra: {r.nakshatra || '—'}</p>
              <p className="text-sm text-stone-700 mt-1">{Array.isArray(r.sevas) ? r.sevas.join(', ') : ''}</p>
              <div className="mt-2"><ConfirmButton onConfirm={async () => { await deleteRow(table, r.id); load(); }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
