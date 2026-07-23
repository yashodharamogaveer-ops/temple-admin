export type AdminRole = 'super_admin' | 'admin'

export interface AdminProfile {
  id: string
  full_name: string
  email: string
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TemplePreset {
  id: string
  name_kn: string
  name_en: string
  address_kn: string
  address_en: string
  phone: string | null
  alt_phone: string | null
  email: string | null
  whatsapp: string | null
  map_link: string | null
  logo_url: string | null
}

export interface Seva {
  id: string
  title_kn: string
  title_en: string
  description_kn: string
  description_en: string
  price: number
  image_url: string | null
  is_active: boolean
  sort_order: number
}

export type MediaKind = 'image' | 'video'
export interface MediaItem {
  id: string
  kind: MediaKind
  url: string
  thumbnail_url: string | null
  caption_kn: string
  caption_en: string
  alt_text_kn: string
  alt_text_en: string
  album: string
  sort_order: number
}

export interface HistoryEntry {
  id: string
  title_kn: string
  title_en: string
  content_kn: string
  content_en: string
  era_year: string | null
  image_url: string | null
  sort_order: number
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export interface EventItem {
  id: string
  title_kn: string
  title_en: string
  description_kn: string
  description_en: string
  location_kn: string
  location_en: string
  image_url: string | null
  event_date: string
  event_time: string | null
  status: EventStatus
  is_featured: boolean
}

export interface NotificationItem {
  id: string
  title_kn: string
  title_en: string
  message_kn: string
  message_en: string
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
}

export interface CommitteeMember {
  id: string
  name_kn: string
  name_en: string
  designation_kn: string
  designation_en: string
  photo_url: string | null
  phone: string | null
  sort_order: number
  is_active: boolean
}
