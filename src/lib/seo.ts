/**
 * SEO helpers: canonical URLs, per-page metadata (with admin overrides) and schema.org JSON-LD.
 * Used by the live site (Helmet) and mirrored by scripts/postbuild.mjs for the pre-rendered HTML.
 */
import type { Language } from '../types';
import { DEFAULT_SITE_URL, SiteContent, SeoPageRow } from './content';

export type SeoPageKey = 'home' | 'about' | 'gallery' | 'seva' | 'contact' | 'privacy' | 'notfound';

export const PAGE_PATHS: Record<SeoPageKey, string> = {
  home: '/', about: '/about', gallery: '/gallery', seva: '/seva',
  contact: '/contact', privacy: '/privacy-policy', notfound: '/404'
};

export const INDEXABLE_PAGES: SeoPageKey[] = ['home', 'about', 'gallery', 'seva', 'contact', 'privacy'];

export const PAGE_LABELS: Record<SeoPageKey, { kn: string; en: string }> = {
  home: { kn: 'ಮುಖಪುಟ', en: 'Home' },
  about: { kn: 'ದೇವಸ್ಥಾನದ ಬಗ್ಗೆ', en: 'About Temple' },
  gallery: { kn: 'ಗ್ಯಾಲರಿ', en: 'Gallery' },
  seva: { kn: 'ಸೇವೆಗಳು', en: 'Sevas & Poojas' },
  contact: { kn: 'ಸಂಪರ್ಕಿಸಿ', en: 'Contact Us' },
  privacy: { kn: 'ಗೌಪ್ಯತಾ ನೀತಿ', en: 'Privacy Policy' },
  notfound: { kn: 'ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ', en: 'Page Not Found' }
};

export const siteUrlOf = (content: SiteContent) =>
  (content.seo.site_url || DEFAULT_SITE_URL).replace(/\/+$/, '');

export function absoluteUrl(site: string, pathOrUrl?: string | null): string {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith('data:')) return '';
  return site + (pathOrUrl.startsWith('/') ? '' : '/') + pathOrUrl;
}

export interface PageSeo {
  title: string; description: string; keywords: string;
  noindex: boolean; image?: string;
}

/** Merge the built-in per-page text with whatever the admin saved for that page. */
export function resolvePageSeo(
  page: SeoPageKey, lang: Language,
  defaults: { title: string; description: string; keywords: string },
  seoRows: SeoPageRow[], content: SiteContent
): PageSeo {
  const row = seoRows.find(r => r.page_key === page);
  const pick = (kn?: string | null, en?: string | null) => ((lang === 'kn' ? kn : en) || '').trim();
  const globalKeywords = lang === 'kn' ? content.seo.default_keywords_kn : content.seo.default_keywords_en;
  const keywords = pick(row?.keywords_kn, row?.keywords_en) || defaults.keywords;
  return {
    title: pick(row?.title_kn, row?.title_en) || defaults.title,
    description: pick(row?.description_kn, row?.description_en) || defaults.description,
    keywords: keywords || (globalKeywords || ''),
    noindex: page === 'notfound' ? true : !!row?.noindex,
    image: row?.og_image_url || content.branding.og_image_url || undefined
  };
}

const DAY_MAP: Record<string, string> = {
  Monday: 'https://schema.org/Monday', Tuesday: 'https://schema.org/Tuesday', Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday', Friday: 'https://schema.org/Friday', Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday'
};

function openingHours(content: SiteContent) {
  const out: any[] = [];
  for (const r of content.timings.schedule || []) {
    const days = (r.days || []).map(d => DAY_MAP[d]).filter(Boolean);
    if (!days.length || !r.opens || !r.closes) continue;
    out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: r.opens, closes: r.closes });
    if (r.opens2 && r.closes2) out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: r.opens2, closes: r.closes2 });
  }
  return out;
}

const clean = (o: any): any => {
  if (Array.isArray(o)) return o.map(clean).filter(v => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0));
  if (o && typeof o === 'object') {
    const r: any = {};
    for (const k of Object.keys(o)) {
      const v = clean(o[k]);
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
      r[k] = v;
    }
    return r;
  }
  return o;
};

export interface JsonLdInput {
  page: SeoPageKey; lang: Language; content: SiteContent;
  title: string; description: string; image?: string;
  address?: string; phones?: string[]; email?: string;
  events?: any[];
}

export function buildJsonLd(i: JsonLdInput): any[] {
  const { content, lang, page } = i;
  const site = siteUrlOf(content);
  const other: Language = lang === 'kn' ? 'en' : 'kn';
  const nameOf = (l: Language) => (l === 'kn'
    ? (content.branding.name_kn || content.seo.site_name_kn)
    : (content.branding.name_en || content.seo.site_name_en)) || '';
  const logo = absoluteUrl(site, content.branding.logo_url);
  const image = absoluteUrl(site, i.image || content.branding.og_image_url) || logo;
  const c = content.contact;

  const temple = clean({
    '@context': 'https://schema.org',
    '@type': 'HinduTemple',
    '@id': `${site}/#temple`,
    name: nameOf(lang),
    alternateName: [nameOf(other)],
    description: i.description,
    url: site + '/',
    logo,
    image: image ? [image] : undefined,
    telephone: (i.phones && i.phones[0]) || undefined,
    email: i.email,
    foundingDate: content.seo.founding_year,
    priceRange: content.seo.price_range,
    isAccessibleForFree: true,
    publicAccess: true,
    address: {
      '@type': 'PostalAddress',
      streetAddress: i.address,
      addressLocality: c.locality,
      addressRegion: c.state,
      postalCode: c.postal_code,
      addressCountry: c.country || 'IN'
    },
    geo: c.latitude && c.longitude ? { '@type': 'GeoCoordinates', latitude: c.latitude, longitude: c.longitude } : undefined,
    hasMap: c.directions_url,
    openingHoursSpecification: openingHours(content),
    sameAs: [content.social.instagram, content.social.facebook, content.social.youtube, content.social.twitter,
      content.seo.google_business_url, ...(content.seo.same_as || [])].filter(Boolean),
    contactPoint: (i.phones && i.phones.length) ? i.phones.map(p => ({
      '@type': 'ContactPoint', telephone: p, contactType: 'temple office', availableLanguage: ['Kannada', 'English']
    })) : undefined
  });

  const website = clean({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site}/#website`,
    url: site + '/',
    name: nameOf(lang),
    inLanguage: ['kn', 'en'],
    publisher: { '@id': `${site}/#temple` }
  });

  const pageUrl = site + (PAGE_PATHS[page] === '/' ? '/' : PAGE_PATHS[page]);
  const webpage = clean({
    '@context': 'https://schema.org',
    '@type': page === 'contact' ? 'ContactPage' : page === 'about' ? 'AboutPage' : page === 'gallery' ? 'ImageGallery' : 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: i.title,
    description: i.description,
    inLanguage: lang,
    isPartOf: { '@id': `${site}/#website` },
    about: { '@id': `${site}/#temple` },
    primaryImageOfPage: image ? { '@type': 'ImageObject', url: image } : undefined
  });

  const graph: any[] = [temple, website, webpage];

  if (page !== 'home') {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: PAGE_LABELS.home[lang], item: site + '/' },
        { '@type': 'ListItem', position: 2, name: PAGE_LABELS[page][lang], item: pageUrl }
      ]
    });
  }

  // Upcoming events (home page shows them) -> Event rich results
  if (page === 'home') {
    for (const e of (i.events || []).slice(0, 10)) {
      const title = (lang === 'kn' ? (e.title_kn || e.title) : (e.title || e.title_kn)) || '';
      const desc = (lang === 'kn' ? (e.description_kn || e.description) : (e.description || e.description_kn)) || '';
      if (!title || !e.event_date) continue;
      const time = typeof e.event_time === 'string' && /^\d{1,2}:\d{2}/.test(e.event_time) ? 'T' + e.event_time.slice(0, 5) + ':00+05:30' : '';
      const date = String(e.event_date).slice(0, 10);
      graph.push(clean({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: title,
        description: desc,
        startDate: date + time,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        image: e.poster_url ? [absoluteUrl(site, e.poster_url)] : undefined,
        location: { '@type': 'Place', name: nameOf(lang), address: { '@type': 'PostalAddress', streetAddress: i.address, addressLocality: c.locality, addressRegion: c.state, postalCode: c.postal_code, addressCountry: c.country || 'IN' } },
        organizer: { '@id': `${site}/#temple` }
      }));
    }
  }
  return graph;
}
