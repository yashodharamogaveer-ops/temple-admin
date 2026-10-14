/**
 * Site content layer
 * ------------------
 * Everything an admin can change from the admin panel lives in the `site_content`
 * table (one JSON row per key) and `seo_pages`. This file:
 *   - describes the shape of that content,
 *   - provides safe defaults (the values that used to be hard-coded in the site),
 *   - merges admin overrides on top of the built-in texts,
 *   - exposes a React hook that loads + caches the content,
 *   - contains the WhatsApp link helper.
 *
 * IMPORTANT: when nothing is saved in the database the site looks exactly as it did before.
 */
import { translations, Language, TranslationData } from '../types';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Bilingual { kn?: string; en?: string }

export interface BrandingContent {
  logo_url?: string;
  favicon_url?: string;
  /** Default image used when a page is shared on WhatsApp / Facebook / Google */
  og_image_url?: string;
  /** Temple name shown in header + footer */
  name_kn?: string; name_en?: string;
  /** Small line below the temple name */
  sub_kn?: string; sub_en?: string;
  /** Browser theme colour (mobile address bar) */
  theme_color?: string;
}

export interface ContactContent {
  address_kn?: string; address_en?: string;
  phones?: string[];
  email?: string;
  /** Number for the floating WhatsApp button, footer icon and event enquiries */
  whatsapp?: string;
  whatsapp_message_kn?: string; whatsapp_message_en?: string;
  maps_embed_url?: string;
  directions_url?: string;
  latitude?: number; longitude?: number;
  postal_code?: string;
  locality?: string; district?: string; state?: string; country?: string;
}

export interface SocialContent {
  instagram?: string; facebook?: string; youtube?: string; twitter?: string; whatsapp_channel?: string;
}

export interface OpeningRule { days: string[]; opens: string; closes: string; opens2?: string; closes2?: string }

export interface TimingsContent {
  /** Footer, first card */
  special_title_kn?: string; special_title_en?: string;
  special_hours_kn?: string; special_hours_en?: string;
  /** Footer, second card */
  other_title_kn?: string; other_title_en?: string;
  other_hours_kn?: string; other_hours_en?: string;
  /** Structured hours — used ONLY for Google (schema.org), not shown on the page */
  schedule?: OpeningRule[];
}

export interface HeroSlide { image_url: string; caption_kn?: string; caption_en?: string }
export interface HeroContent { slides?: HeroSlide[]; interval_sec?: number }

export interface FooterContent {
  copyright_kn?: string; copyright_en?: string;
  developer_label?: string; developer_name?: string; developer_url?: string;
  show_developer?: boolean;
}

export interface FeatureToggles {
  show_whatsapp_float?: boolean;
  show_back_to_top?: boolean;
  show_language_toggle?: boolean;
  show_footer_map?: boolean;
  show_footer_timings?: boolean;
  show_social_icons?: boolean;
}

export interface IntegrationsContent {
  ga4_id?: string;          // G-XXXXXXX
  gtm_id?: string;          // GTM-XXXXXX
  google_site_verification?: string;
  bing_site_verification?: string;
}

export interface SeoGlobalContent {
  site_url?: string;                 // https://www.haadikereshaneshwara.com
  site_name_kn?: string; site_name_en?: string;
  twitter_handle?: string;
  default_keywords_kn?: string; default_keywords_en?: string;
  founding_year?: string;
  price_range?: string;
  /** Short facts that AI assistants (ChatGPT, Gemini, Perplexity, Claude) read from /llms.txt */
  ai_summary_kn?: string; ai_summary_en?: string;
  allow_ai_crawlers?: boolean;
  same_as?: string[];                // wikipedia / google business profile / etc
  google_business_url?: string;
}

export interface SiteContent {
  branding: BrandingContent;
  contact: ContactContent;
  social: SocialContent;
  timings: TimingsContent;
  hero: HeroContent;
  footer: FooterContent;
  features: FeatureToggles;
  integrations: IntegrationsContent;
  seo: SeoGlobalContent;
  /** Overrides for the main `translations` object, keyed by dotted path e.g. "hero.welcome" */
  core_texts: Record<string, Bilingual>;
  /** Overrides for inline page texts, keyed by id from stringCatalog */
  strings: Record<string, Bilingual>;
}

export interface SeoPageRow {
  page_key: string;
  title_kn?: string | null; title_en?: string | null;
  description_kn?: string | null; description_en?: string | null;
  keywords_kn?: string | null; keywords_en?: string | null;
  og_image_url?: string | null;
  noindex?: boolean | null;
}

export const CONTENT_KEYS: (keyof SiteContent)[] = [
  'branding', 'contact', 'social', 'timings', 'hero', 'footer', 'features',
  'integrations', 'seo', 'core_texts', 'strings'
];

export const DEFAULT_SITE_URL = 'https://www.haadikereshaneshwara.com';

/** Values that used to be hard-coded in the website. Used whenever the admin has not saved anything. */
export const DEFAULT_CONTENT: SiteContent = {
  branding: { theme_color: '#ea580c' },
  contact: {
    directions_url: 'https://maps.app.goo.gl/wafQnU8wtXiP43dL9',
    latitude: 13.525199802500058,
    longitude: 74.7048578748017,
    postal_code: '576221',
    locality: 'Haadikere, Brahmavara',
    district: 'Udupi',
    state: 'Karnataka',
    country: 'IN'
  },
  social: {
    instagram: 'https://instagram.com/haadikere_shanitemple',
    facebook: 'https://facebook.com/haadikereshanitemple'
  },
  timings: {
    special_title_kn: 'ಸೋಮವಾರ ಮತ್ತು ಶನಿವಾರ (ವಿಶೇಷ ಪೂಜೆ)',
    special_title_en: 'Monday & Saturday (Special Puja)',
    special_hours_kn: 'ಬೆಳಿಗ್ಗೆ 6:00 ರಿಂದ ರಾತ್ರಿ 8:00 ರವರೆಗೆ',
    special_hours_en: '6:00 AM to 8:00 PM',
    other_title_kn: 'ಇತರ ದಿನಗಳು',
    other_title_en: 'Other Days',
    other_hours_kn: 'ಬೆಳಿಗ್ಗೆ 7:00 - ಮಧ್ಯಾಹ್ನ 1:00 | ಸಂಜೆ 4:30 - ರಾತ್ರಿ 7:30',
    other_hours_en: '7:00 AM - 1:00 PM | 4:30 PM - 7:30 PM',
    schedule: [
      { days: ['Monday', 'Saturday'], opens: '06:00', closes: '20:00' },
      { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'], opens: '07:00', closes: '13:00', opens2: '16:30', closes2: '19:30' }
    ]
  },
  hero: { slides: [], interval_sec: 6 },
  footer: {
    copyright_kn: 'ಶ್ರೀ ಕ್ಷೇತ್ರ ಹಾಡಿಕೆರೆ ದೇವಸ್ಥಾನ ಟ್ರಸ್ಟ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    copyright_en: 'Shri Kshetra Haadikere Temple Trust. All rights reserved.',
    developer_label: 'Designed & Developed by',
    developer_name: 'Yashodhar Mogaveer',
    developer_url: '',
    show_developer: true
  },
  features: {
    show_whatsapp_float: true,
    show_back_to_top: true,
    show_language_toggle: true,
    show_footer_map: true,
    show_footer_timings: true,
    show_social_icons: true
  },
  integrations: {},
  seo: {
    site_url: DEFAULT_SITE_URL,
    site_name_kn: 'ಶಾಂತಮೂರ್ತಿ ಶ್ರೀ ಶನೀಶ್ವರ ದೇವಸ್ಥಾನ, ಹಾಡಿಕೆರೆ',
    site_name_en: 'Shantamurthy Sri Shaneshwara Temple, Haadikere',
    allow_ai_crawlers: true,
    same_as: []
  },
  core_texts: {},
  strings: {}
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const isPlainObject = (v: unknown): v is Record<string, any> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

/** Deep-merge `over` onto `base`. Empty strings / null / undefined in `over` never erase a default. */
export function mergeDefined<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) {
    return Array.isArray(over) && over.length > 0 ? (over as any) : base;
  }
  if (isPlainObject(base) && isPlainObject(over)) {
    const out: Record<string, any> = { ...base };
    for (const k of Object.keys(over)) out[k] = mergeDefined((base as any)[k], over[k]);
    return out as T;
  }
  if (typeof over === 'string' && over.trim() === '') return base;
  return over as T;
}

/** FNV-1a over UTF-16 code units. Must match scripts/extract-strings.py */
export function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export const textId = (kn: string, en: string) => 's' + fnv1a(kn + '\u0001' + en);

/** Build the tx() function the page uses for inline Kannada/English texts. */
export function makeTx(lang: Language, strings: Record<string, Bilingual> | undefined) {
  return (kn: string, en: string): string => {
    const override = strings?.[textId(kn, en)];
    const picked = lang === 'kn' ? override?.kn : override?.en;
    if (picked && picked.trim()) return picked;
    return lang === 'kn' ? kn : en;
  };
}

/** Flatten the translations object to dotted paths (used by the admin and by applyCoreTexts). */
export function flattenTexts(obj: any, prefix = ''): { path: string; value: string }[] {
  const out: { path: string; value: string }[] = [];
  if (typeof obj === 'string') return [{ path: prefix, value: obj }];
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => out.push(...flattenTexts(v, prefix ? `${prefix}.${i}` : String(i))));
  } else if (isPlainObject(obj)) {
    for (const k of Object.keys(obj)) out.push(...flattenTexts(obj[k], prefix ? `${prefix}.${k}` : k));
  }
  return out;
}

function setByPath(target: any, path: string, value: string) {
  const parts = path.split('.');
  let cur = target;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur == null) return;
    cur = cur[parts[i]];
  }
  if (cur == null) return;
  const last = parts[parts.length - 1];
  if (last in cur || Array.isArray(cur)) cur[last] = value;
}

/** Returns the translations for one language with admin overrides applied. */
export function resolveTranslations(lang: Language, content: SiteContent): TranslationData {
  const t: TranslationData = JSON.parse(JSON.stringify(translations[lang]));
  const { core_texts, branding, contact, footer } = content;

  for (const path of Object.keys(core_texts || {})) {
    const v = core_texts[path]?.[lang];
    if (v && v.trim()) setByPath(t, path, v);
  }

  // Dedicated settings win over the generic text overrides
  const name = lang === 'kn' ? branding.name_kn : branding.name_en;
  const sub = lang === 'kn' ? branding.sub_kn : branding.sub_en;
  if (name?.trim()) t.templeName = name;
  if (sub?.trim()) t.templeSub = sub;

  const address = lang === 'kn' ? contact.address_kn : contact.address_en;
  if (address?.trim()) t.contactSection.address = address;
  const phones = (contact.phones || []).map(p => p.trim()).filter(Boolean);
  if (phones.length) t.contactSection.phones = phones;
  if (contact.email?.trim()) t.contactSection.email = contact.email.trim();

  const rights = lang === 'kn' ? footer.copyright_kn : footer.copyright_en;
  if (rights?.trim()) t.footer.rights = rights;
  return t;
}

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

/**
 * Turns anything an admin may type into a number WhatsApp accepts (digits only, with country code).
 *   "99022 07990"        -> 919902207990
 *   "+91 99022 07990"    -> 919902207990
 *   "09902207990"        -> 919902207990
 *   "https://wa.me/9199…"-> 9199…
 * Returns '' when the number cannot be valid.
 *
 * This was the cause of the broken floating button: wa.me needs the country code, and a number
 * stored without it (10 digits) opens a "phone number shared via url is invalid" page.
 */
export function toWhatsAppNumber(raw?: string | null, defaultCountryCode = '91'): string {
  if (!raw) return '';
  let s = String(raw).trim();
  const fromUrl = s.match(/wa\.me\/(\+?\d+)/i) || s.match(/[?&]phone=(\+?\d+)/i);
  if (fromUrl) s = fromUrl[1];
  let d = s.replace(/\D/g, '');
  d = d.replace(/^00/, '');
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) d = defaultCountryCode + d;
  if (d.length < 11 || d.length > 15) return '';
  return d;
}

export function buildWhatsAppLink(raw?: string | null, text?: string): string {
  const n = toWhatsAppNumber(raw);
  if (!n) return '';
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Opens WhatsApp reliably, also inside in-app browsers that swallow target="_blank". */
export function openWhatsApp(url: string) {
  if (!url) return;
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  if (!w) window.location.href = url;
}

/* ------------------------------------------------------------------ */
/* Compose                                                             */
/* ------------------------------------------------------------------ */
export function composeContent(rows: Partial<SiteContent>): SiteContent {
  const out: any = {};
  for (const k of CONTENT_KEYS) out[k] = mergeDefined((DEFAULT_CONTENT as any)[k], (rows as any)[k]);
  return out as SiteContent;
}
