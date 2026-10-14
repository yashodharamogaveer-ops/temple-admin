import React, { useState } from 'react';
import { ExternalLink, Plus, X } from 'lucide-react';
import { OpeningRule } from '../../lib/content';
import { buildWhatsAppLink, toWhatsAppNumber } from '../../lib/content';
import { useContent } from '../useContent';
import { BiText, Button, Card, ImageField, Loading, PageHeader, SaveBar, Tabs, TextInput, Toggle, Field } from '../ui';

type Tab = 'branding' | 'contact' | 'social' | 'timings' | 'footer' | 'visibility';
const KEYS = ['branding', 'contact', 'social', 'timings', 'footer', 'features'] as const;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Accepts a pasted <iframe …> snippet or a plain URL and returns the embed URL. */
const extractEmbed = (v: string) => {
  const m = v.match(/src=["']([^"']+)["']/i);
  return (m ? m[1] : v).trim();
};

export default function SettingsPage() {
  const c = useContent([...KEYS]);
  const [tab, setTab] = useState<Tab>('branding');
  if (c.error) return <p className="text-red-700 text-sm">{c.error}</p>;
  if (!c.data) return <Loading />;
  const d = c.data;
  const waNumber = toWhatsAppNumber(d.contact.whatsapp);
  const waTest = buildWhatsAppLink(d.contact.whatsapp, (d.contact.whatsapp_message_en || 'Test message from admin panel'));
  const phones = d.contact.phones && d.contact.phones.length ? d.contact.phones : [''];
  const schedule = d.timings.schedule || [];
  const setRule = (i: number, patch: Partial<OpeningRule>) =>
    c.update('timings', { schedule: schedule.map((r, j) => (j === i ? { ...r, ...patch } : r)) });

  return (
    <div>
      <PageHeader title="Site settings" subtitle="Logo, temple name, address, phone numbers, WhatsApp, footer and what appears on the website." />
      <Tabs value={tab} onChange={setTab} tabs={[
        { id: 'branding', label: 'Logo & name' }, { id: 'contact', label: 'Contact & map' }, { id: 'social', label: 'Social links' },
        { id: 'timings', label: 'Timings' }, { id: 'footer', label: 'Footer' }, { id: 'visibility', label: 'Show / hide' }
      ]} />

      {tab === 'branding' && (
        <div className="space-y-5">
          <Card title="Logo & icons">
            <div className="grid md:grid-cols-3 gap-5">
              <ImageField label="Logo" value={d.branding.logo_url} onChange={v => c.update('branding', { logo_url: v })} folder="branding" maxDim={600} round
                help="Shown in the header. Square image works best." />
              <ImageField label="Browser icon (favicon)" value={d.branding.favicon_url} onChange={v => c.update('branding', { favicon_url: v })} folder="branding" maxDim={256}
                help="Small square PNG, at least 192×192." />
              <ImageField label="Share image" value={d.branding.og_image_url} onChange={v => c.update('branding', { og_image_url: v })} folder="branding" maxDim={1600}
                help="Appears when the link is shared on WhatsApp / Facebook / Google. Use 1200×630." />
            </div>
          </Card>
          <Card title="Temple name">
            <div className="space-y-4">
              <BiText label="Name (header & footer)" kn={d.branding.name_kn} en={d.branding.name_en} onKn={v => c.update('branding', { name_kn: v })} onEn={v => c.update('branding', { name_en: v })}
                help="Leave empty to keep the built-in name." />
              <BiText label="Line below the name" kn={d.branding.sub_kn} en={d.branding.sub_en} onKn={v => c.update('branding', { sub_kn: v })} onEn={v => c.update('branding', { sub_en: v })} />
              <Field label="Phone browser colour" help="Colour of the address bar on Android Chrome.">
                <input type="color" value={d.branding.theme_color || '#ea580c'} onChange={e => c.update('branding', { theme_color: e.target.value })} className="h-11 w-20 rounded-lg border border-stone-300 cursor-pointer" />
              </Field>
            </div>
          </Card>
        </div>
      )}

      {tab === 'contact' && (
        <div className="space-y-5">
          <Card title="Address">
            <div className="space-y-4">
              <BiText label="Full address" multiline rows={3} kn={d.contact.address_kn} en={d.contact.address_en}
                onKn={v => c.update('contact', { address_kn: v })} onEn={v => c.update('contact', { address_en: v })} help="Used on the Contact page, footer, Privacy page and for Google." />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <TextInput label="Locality" value={d.contact.locality} onChange={v => c.update('contact', { locality: v })} />
                <TextInput label="District" value={d.contact.district} onChange={v => c.update('contact', { district: v })} />
                <TextInput label="State" value={d.contact.state} onChange={v => c.update('contact', { state: v })} />
                <TextInput label="PIN code" value={d.contact.postal_code} onChange={v => c.update('contact', { postal_code: v })} inputMode="numeric" />
              </div>
            </div>
          </Card>

          <Card title="Phone numbers & email">
            <div className="space-y-3">
              {phones.map((p, i) => (
                <div key={i} className="flex items-end gap-2">
                  <TextInput className="flex-1" label={i === 0 ? 'Phone numbers' : undefined} type="tel" placeholder="+91 99022 07990" value={p}
                    onChange={v => c.update('contact', { phones: phones.map((x, j) => (j === i ? v : x)) })} />
                  {phones.length > 1 && <Button variant="ghost" onClick={() => c.update('contact', { phones: phones.filter((_, j) => j !== i) })} aria-label="Remove"><X className="w-4 h-4" /></Button>}
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => c.update('contact', { phones: [...phones, ''] })}><Plus className="w-3.5 h-3.5" /> Add number</Button>
              <TextInput label="Email" type="email" value={d.contact.email} onChange={v => c.update('contact', { email: v })} />
            </div>
          </Card>

          <Card title="WhatsApp" subtitle="Used by the floating green button, the footer icon, the Contact page and event enquiries.">
            <div className="space-y-4">
              <TextInput label="WhatsApp number" type="tel" placeholder="+91 99022 07990" value={d.contact.whatsapp}
                onChange={v => c.update('contact', { whatsapp: v })}
                help="Any format works — spaces, +91 or a 10-digit number are fixed automatically." />
              <div className={`rounded-xl border p-3.5 text-sm ${waNumber ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
                {waNumber ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span>Chat link will open <b>wa.me/{waNumber}</b></span>
                    <a href={waTest} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold underline">Test it now <ExternalLink className="w-3.5 h-3.5" /></a>
                  </div>
                ) : <span>{d.contact.whatsapp ? 'This does not look like a valid phone number.' : 'No number saved — the built-in temple number is used.'}</span>}
              </div>
              <BiText label="Pre-filled first message (optional)" multiline rows={2} kn={d.contact.whatsapp_message_kn} en={d.contact.whatsapp_message_en}
                onKn={v => c.update('contact', { whatsapp_message_kn: v })} onEn={v => c.update('contact', { whatsapp_message_en: v })}
                help="Example: “Namaste, I would like to know about the temple timings.”" />
            </div>
          </Card>

          <Card title="Map & directions">
            <div className="space-y-4">
              <TextInput label="Google Maps embed link" placeholder="Paste the whole <iframe …> code or its src link"
                value={d.contact.maps_embed_url} onChange={v => c.update('contact', { maps_embed_url: extractEmbed(v) })}
                help="Google Maps → Share → Embed a map → Copy HTML. The link is picked out automatically." />
              <TextInput label="“Get directions” link" placeholder="https://maps.app.goo.gl/…" value={d.contact.directions_url} onChange={v => c.update('contact', { directions_url: v })} />
              <div className="grid grid-cols-2 gap-3">
                <TextInput label="Latitude" inputMode="decimal" value={d.contact.latitude ?? ''} onChange={v => c.update('contact', { latitude: v === '' ? undefined : Number(v) })} help="For Google search (map pin)." />
                <TextInput label="Longitude" inputMode="decimal" value={d.contact.longitude ?? ''} onChange={v => c.update('contact', { longitude: v === '' ? undefined : Number(v) })} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'social' && (
        <Card title="Social media" subtitle="Icons appear in the footer. Leave a field empty to hide that icon.">
          <div className="space-y-4">
            <TextInput label="Instagram" type="url" placeholder="https://instagram.com/…" value={d.social.instagram} onChange={v => c.update('social', { instagram: v })} />
            <TextInput label="Facebook" type="url" placeholder="https://facebook.com/…" value={d.social.facebook} onChange={v => c.update('social', { facebook: v })} />
            <TextInput label="YouTube" type="url" placeholder="https://youtube.com/@…" value={d.social.youtube} onChange={v => c.update('social', { youtube: v })} />
            <TextInput label="X / Twitter" type="url" value={d.social.twitter} onChange={v => c.update('social', { twitter: v })} help="Only used for search engines (not shown on the page)." />
          </div>
        </Card>
      )}

      {tab === 'timings' && (
        <div className="space-y-5">
          <Card title="Footer timing cards" subtitle="The two boxes under “Temple Timings” in the footer. The big timing text in the home-page banner is in Page texts → hero.">
            <div className="space-y-4">
              <BiText label="Card 1 — title" kn={d.timings.special_title_kn} en={d.timings.special_title_en} onKn={v => c.update('timings', { special_title_kn: v })} onEn={v => c.update('timings', { special_title_en: v })} />
              <BiText label="Card 1 — hours" kn={d.timings.special_hours_kn} en={d.timings.special_hours_en} onKn={v => c.update('timings', { special_hours_kn: v })} onEn={v => c.update('timings', { special_hours_en: v })} />
              <BiText label="Card 2 — title" kn={d.timings.other_title_kn} en={d.timings.other_title_en} onKn={v => c.update('timings', { other_title_kn: v })} onEn={v => c.update('timings', { other_title_en: v })} />
              <BiText label="Card 2 — hours" kn={d.timings.other_hours_kn} en={d.timings.other_hours_en} onKn={v => c.update('timings', { other_hours_kn: v })} onEn={v => c.update('timings', { other_hours_en: v })} />
            </div>
          </Card>
          <Card title="Opening hours for Google" subtitle="Not shown on the page. Google uses it to show “Open now” for the temple. Keep it in sync with the text above.">
            <div className="space-y-4">
              {schedule.map((r, i) => (
                <div key={i} className="rounded-xl border border-stone-200 p-3.5 space-y-3 bg-stone-50/60">
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS.map(day => {
                      const on = r.days.includes(day);
                      return (
                        <button key={day} type="button" onClick={() => setRule(i, { days: on ? r.days.filter(x => x !== day) : [...r.days, day] })}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${on ? 'bg-saffron-600 text-white' : 'bg-white border border-stone-300 text-stone-600'}`}>{day.slice(0, 3)}</button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <TextInput label="Opens" type="time" value={r.opens} onChange={v => setRule(i, { opens: v })} />
                    <TextInput label="Closes" type="time" value={r.closes} onChange={v => setRule(i, { closes: v })} />
                    <TextInput label="Re-opens (optional)" type="time" value={r.opens2 || ''} onChange={v => setRule(i, { opens2: v })} />
                    <TextInput label="Closes (optional)" type="time" value={r.closes2 || ''} onChange={v => setRule(i, { closes2: v })} />
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => c.update('timings', { schedule: schedule.filter((_, j) => j !== i) })}>Remove this row</Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={() => c.update('timings', { schedule: [...schedule, { days: [], opens: '07:00', closes: '13:00' }] })}><Plus className="w-3.5 h-3.5" /> Add hours row</Button>
            </div>
          </Card>
        </div>
      )}

      {tab === 'footer' && (
        <Card title="Footer">
          <div className="space-y-4">
            <BiText label="Copyright line (year is added automatically)" kn={d.footer.copyright_kn} en={d.footer.copyright_en} multiline rows={2}
              onKn={v => c.update('footer', { copyright_kn: v })} onEn={v => c.update('footer', { copyright_en: v })} />
            <Toggle label="Show developer credit" checked={d.footer.show_developer !== false} onChange={v => c.update('footer', { show_developer: v })} />
            {d.footer.show_developer !== false && (
              <div className="grid md:grid-cols-3 gap-3">
                <TextInput label="Label" value={d.footer.developer_label} onChange={v => c.update('footer', { developer_label: v })} />
                <TextInput label="Name" value={d.footer.developer_name} onChange={v => c.update('footer', { developer_name: v })} />
                <TextInput label="Link (optional)" type="url" value={d.footer.developer_url} onChange={v => c.update('footer', { developer_url: v })} />
              </div>
            )}
            <p className="text-xs text-stone-500">Footer column titles (“Quick Navigation”, “Google Map Route”…) can be changed in Page texts → Footer.</p>
          </div>
        </Card>
      )}

      {tab === 'visibility' && (
        <Card title="Show or hide parts of the website" subtitle="Changes apply immediately after saving.">
          <div className="divide-y divide-stone-100">
            <Toggle label="Floating WhatsApp button" help="Green button at the bottom-right corner." checked={d.features.show_whatsapp_float !== false} onChange={v => c.update('features', { show_whatsapp_float: v })} />
            <Toggle label="Back-to-top button" checked={d.features.show_back_to_top !== false} onChange={v => c.update('features', { show_back_to_top: v })} />
            <Toggle label="Language switch (ಕನ್ನಡ / English)" checked={d.features.show_language_toggle !== false} onChange={v => c.update('features', { show_language_toggle: v })} />
            <Toggle label="Footer: timings" checked={d.features.show_footer_timings !== false} onChange={v => c.update('features', { show_footer_timings: v })} />
            <Toggle label="Footer: map" checked={d.features.show_footer_map !== false} onChange={v => c.update('features', { show_footer_map: v })} />
            <Toggle label="Footer: social icons" checked={d.features.show_social_icons !== false} onChange={v => c.update('features', { show_social_icons: v })} />
          </div>
        </Card>
      )}

      <SaveBar dirty={c.dirty} saving={c.saving} onSave={c.save} onReset={c.reset} />
    </div>
  );
}
