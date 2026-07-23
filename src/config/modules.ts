import type { ModuleConfig } from '@/config/fieldTypes'
import type { Seva, EventItem, HistoryEntry, CommitteeMember, NotificationItem } from '@/types'

export const sevaConfig: ModuleConfig<Seva> = {
  table: 'sevas',
  title: 'Seva Management',
  description: 'Manage the sevas displayed on the temple website.',
  order: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'title_kn', label: 'Title (KN)' },
    { key: 'title_en', label: 'Title (EN)' },
    { key: 'price', label: 'Price (₹)' },
    { key: 'is_active', label: 'Status' },
  ],
  fields: [
    { type: 'bilingual-text', base: 'title', label: 'Seva Name', required: true },
    { type: 'bilingual-textarea', base: 'description', label: 'Description' },
    { type: 'number', name: 'price', label: 'Price (₹)' },
    { type: 'image', name: 'image_url', label: 'Seva Image', folder: 'sevas' },
    { type: 'number', name: 'sort_order', label: 'Display Order' },
    { type: 'boolean', name: 'is_active', label: 'Active on website' },
  ],
  emptyDefaults: {
    title_kn: '', title_en: '', description_kn: '', description_en: '',
    price: 0, image_url: null, sort_order: 0, is_active: true,
  },
}

export const eventsConfig: ModuleConfig<EventItem> = {
  table: 'events',
  title: 'Events & Festivals',
  description: 'Manage upcoming events and festivals.',
  order: { column: 'event_date', ascending: true },
  columns: [
    { key: 'title_kn', label: 'Title (KN)' },
    { key: 'title_en', label: 'Title (EN)' },
    { key: 'event_date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'is_featured', label: 'Featured' },
  ],
  fields: [
    { type: 'bilingual-text', base: 'title', label: 'Event Title', required: true },
    { type: 'bilingual-textarea', base: 'description', label: 'Description' },
    { type: 'bilingual-text', base: 'location', label: 'Location' },
    { type: 'image', name: 'image_url', label: 'Event Image', folder: 'events' },
    { type: 'date', name: 'event_date', label: 'Event Date', required: true },
    { type: 'time', name: 'event_time', label: 'Event Time' },
    {
      type: 'select', name: 'status', label: 'Status',
      options: [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'ongoing', label: 'Ongoing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    { type: 'boolean', name: 'is_featured', label: 'Feature on homepage' },
  ],
  emptyDefaults: {
    title_kn: '', title_en: '', description_kn: '', description_en: '',
    location_kn: '', location_en: '', image_url: null,
    event_date: '', event_time: '', status: 'upcoming', is_featured: false,
  },
}

export const historyConfig: ModuleConfig<HistoryEntry> = {
  table: 'temple_history',
  title: 'Temple History',
  description: 'Manage the historical timeline shown on the website.',
  order: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'title_kn', label: 'Title (KN)' },
    { key: 'title_en', label: 'Title (EN)' },
    { key: 'era_year', label: 'Year / Era' },
  ],
  fields: [
    { type: 'bilingual-text', base: 'title', label: 'Section Title', required: true },
    { type: 'text', name: 'era_year', label: 'Year / Era', placeholder: 'e.g. 1520 CE' },
    { type: 'bilingual-textarea', base: 'content', label: 'History Content', rows: 6 },
    { type: 'image', name: 'image_url', label: 'Image', folder: 'history' },
    { type: 'number', name: 'sort_order', label: 'Display Order' },
  ],
  emptyDefaults: {
    title_kn: '', title_en: '', era_year: '', content_kn: '', content_en: '',
    image_url: null, sort_order: 0,
  },
}

export const committeeConfig: ModuleConfig<CommitteeMember> = {
  table: 'committee_members',
  title: 'Committee Members',
  description: 'Manage the temple committee / trustee list.',
  order: { column: 'sort_order', ascending: true },
  columns: [
    { key: 'name_kn', label: 'Name (KN)' },
    { key: 'name_en', label: 'Name (EN)' },
    { key: 'designation_en', label: 'Designation' },
    { key: 'is_active', label: 'Status' },
  ],
  fields: [
    { type: 'bilingual-text', base: 'name', label: 'Full Name', required: true },
    { type: 'bilingual-text', base: 'designation', label: 'Designation' },
    { type: 'image', name: 'photo_url', label: 'Photo', folder: 'committee' },
    { type: 'text', name: 'phone', label: 'Phone Number' },
    { type: 'number', name: 'sort_order', label: 'Display Order' },
    { type: 'boolean', name: 'is_active', label: 'Active' },
  ],
  emptyDefaults: {
    name_kn: '', name_en: '', designation_kn: '', designation_en: '',
    photo_url: null, phone: '', sort_order: 0, is_active: true,
  },
}

export const notificationsConfig: ModuleConfig<NotificationItem> = {
  table: 'notifications',
  title: 'Notifications',
  description: 'Manage site-wide announcement banners.',
  order: { column: 'starts_at', ascending: false },
  columns: [
    { key: 'title_kn', label: 'Title (KN)' },
    { key: 'title_en', label: 'Title (EN)' },
    { key: 'is_active', label: 'Status' },
  ],
  fields: [
    { type: 'bilingual-text', base: 'title', label: 'Notification Title', required: true },
    { type: 'bilingual-textarea', base: 'message', label: 'Message' },
    { type: 'date', name: 'starts_at', label: 'Start Date' },
    { type: 'date', name: 'ends_at', label: 'End Date' },
    { type: 'boolean', name: 'is_active', label: 'Active' },
  ],
  emptyDefaults: {
    title_kn: '', title_en: '', message_kn: '', message_en: '',
    starts_at: '', ends_at: '', is_active: true,
  },
}
