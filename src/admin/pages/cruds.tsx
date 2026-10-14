import type { CrudConfig } from './Crud';

const trunc = (s?: string | null, n = 110) => (s ? (s.length > n ? s.slice(0, n) + '…' : s) : undefined);
const stripHtml = (s?: string | null) => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const sevasCfg: CrudConfig = {
  title: 'Sevas & Poojas',
  subtitle: 'Information shown on the Sevas page. The website does not take bookings or payments here.',
  table: 'sevas', addLabel: 'Add seva', order: { col: 'sort_order' }, sortColumn: 'sort_order', activeColumn: 'is_active',
  defaults: { is_active: true, price: null },
  required: [],
  fields: [
    { type: 'bi', label: 'Seva name', kn: 'title_kn', en: 'title_en' },
    { type: 'number', name: 'price', label: 'Seva fee (₹)', help: 'Leave empty if there is no fixed fee.' },
    { type: 'bi', label: 'Description', kn: 'description_kn', en: 'description_en', multiline: true, rows: 3 },
    { type: 'toggle', name: 'is_active', label: 'Show on website' }
  ],
  rowTitle: r => r.title_en || r.title_kn || r.name,
  rowSub: r => trunc(r.description_en || r.description_kn),
  rowBadges: r => (r.price ? [{ text: '₹' + r.price, tone: 'amber' as const }] : [])
};

export const eventsCfg: CrudConfig = {
  title: 'Events & Festivals',
  subtitle: 'Upcoming events appear on the home page and in Google search (Event rich results).',
  table: 'events', addLabel: 'Add event', order: { col: 'event_date', asc: false },
  defaults: {},
  fields: [
    { type: 'bi', label: 'Event title', kn: 'title_kn', en: 'title_en' },
    { type: 'date', name: 'event_date', label: 'Date' },
    { type: 'text', name: 'event_time', label: 'Time', placeholder: '18:30', help: 'Use 24-hour format like 06:30 or 18:30 so Google can read it.' },
    { type: 'bi', label: 'Details', kn: 'description_kn', en: 'description_en', multiline: true, rows: 4 },
    { type: 'image', name: 'image_url', label: 'Poster / invitation image', folder: 'events', maxDim: 1800 }
  ],
  required: ['event_date'],
  rowTitle: r => r.title_en || r.title_kn,
  rowSub: r => [r.event_date, r.event_time].filter(Boolean).join(' · '),
  rowImage: r => r.image_url,
  rowBadges: r => (r.event_date && new Date(r.event_date) < new Date(new Date().toDateString()) ? [{ text: 'Past', tone: 'stone' as const }] : [{ text: 'Upcoming', tone: 'green' as const }])
};

export const committeeCfg: CrudConfig = {
  title: 'Trustees & Priests',
  subtitle: 'People listed on the Contact page. Phone numbers get Call and WhatsApp buttons automatically.',
  table: 'committee_members', addLabel: 'Add person', order: { col: 'sort_order' }, sortColumn: 'sort_order', activeColumn: 'is_active',
  defaults: { is_active: true },
  fields: [
    { type: 'bi', label: 'Name', kn: 'name_kn', en: 'name_en' },
    { type: 'bi', label: 'Role / designation', kn: 'designation_kn', en: 'designation_en' },
    { type: 'image', name: 'photo_url', label: 'Photo', folder: 'people', round: true, maxDim: 800 },
    { type: 'tel', name: 'phone', label: 'Phone', placeholder: '+91 99022 07990', help: 'Include the country code if possible. A 10-digit Indian number also works.' },
    { type: 'email', name: 'email', label: 'Email' },
    { type: 'toggle', name: 'is_active', label: 'Show on website' }
  ],
  rowTitle: r => r.name_en || r.name_kn,
  rowSub: r => [r.designation_en || r.designation_kn, r.phone].filter(Boolean).join(' · '),
  rowImage: r => r.photo_url
};

export const announcementsCfg: CrudConfig = {
  title: 'Announcements',
  subtitle: 'Shown in the scrolling bar at the top of the home page. Hide an item when it is no longer relevant.',
  table: 'announcements', addLabel: 'Add announcement', order: { col: 'created_at', asc: false }, activeColumn: 'is_active',
  defaults: { is_active: true },
  fields: [
    { type: 'bi', label: 'Message', kn: 'message_kn', en: 'message_en', multiline: true, rows: 2, help: 'Keep it short — it scrolls across the screen.' },
    { type: 'toggle', name: 'is_active', label: 'Show on website' }
  ],
  rowTitle: r => r.message_en || r.message_kn || r.message || r.title_en || r.title_kn || r.title,
  rowSub: r => (r.message_en && r.message_kn ? trunc(r.message_kn) : undefined)
};

export const notificationsCfg: CrudConfig = {
  ...announcementsCfg,
  title: 'Notifications',
  subtitle: 'Also shown in the top scrolling bar. Use for short notices such as holiday timings.',
  table: 'notifications', addLabel: 'Add notification'
};

export const aboutFeaturesCfg: CrudConfig = {
  title: 'About — highlights',
  subtitle: 'The “Sacred Significance & Offerings” cards on the About page.',
  table: 'about_features', addLabel: 'Add highlight', order: { col: 'id' },
  defaults: {},
  fields: [
    { type: 'bi', label: 'Title', kn: 'title_kn', en: 'title' },
    { type: 'bi', label: 'Description', kn: 'desc_kn', en: 'desc', multiline: true, rows: 3 }
  ],
  rowTitle: r => r.title || r.title_kn,
  rowSub: r => trunc(r.desc || r.desc_kn)
};

export const historyCfg: CrudConfig = {
  title: 'Temple history',
  subtitle: 'History text for the home page preview and the About page. The first entry is used on the home page.',
  table: 'temple_history', addLabel: 'Add history section', order: { col: 'sort_order' }, sortColumn: 'sort_order',
  defaults: {},
  fields: [
    { type: 'bi', label: 'Heading', kn: 'title_kn', en: 'title_en' },
    { type: 'bi', label: 'Sub-heading (optional)', kn: 'subtitle_kn', en: 'subtitle' },
    { type: 'text', name: 'era_year', label: 'Era / year (optional)', placeholder: 'e.g. 1995' },
    { type: 'bi', label: 'Text', kn: 'content_kn', en: 'content_en', multiline: true, rows: 8, help: 'Leave a blank line between paragraphs.' }
  ],
  rowTitle: r => r.title_en || r.title_kn,
  rowSub: r => trunc(stripHtml(r.content_en || r.content_kn), 140)
};

export const faqCfg: CrudConfig = {
  title: 'Questions & answers for AI / search',
  subtitle: 'Common devotee questions. These are published in /llms.txt so AI assistants (ChatGPT, Gemini, Perplexity, Claude) answer correctly about your temple.',
  table: 'faqs', addLabel: 'Add question', order: { col: 'sort_order' }, sortColumn: 'sort_order', activeColumn: 'is_active',
  defaults: { is_active: true },
  fields: [
    { type: 'bi', label: 'Question', kn: 'question_kn', en: 'question_en' },
    { type: 'bi', label: 'Answer', kn: 'answer_kn', en: 'answer_en', multiline: true, rows: 4, help: 'Be factual and specific (timings, address, how to reach, what to bring).' }
  ],
  rowTitle: r => r.question_en || r.question_kn,
  rowSub: r => trunc(r.answer_en || r.answer_kn)
};
