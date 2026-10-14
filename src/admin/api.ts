import { supabase } from '../supabase';
import { CONTENT_KEYS, DEFAULT_CONTENT, SiteContent, mergeDefined } from '../lib/content';

export const BUCKET = 'site-media';

export function sb() {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  return supabase;
}

export const errMsg = (e: any): string =>
  e?.message || e?.error_description || (typeof e === 'string' ? e : 'Something went wrong');

/* ---------------- site_content ---------------- */

export async function loadAllContent(): Promise<SiteContent> {
  const { data, error } = await sb().from('site_content').select('key,value');
  if (error) throw error;
  const rows: any = {};
  (data || []).forEach((r: any) => { rows[r.key] = r.value; });
  const out: any = {};
  for (const k of CONTENT_KEYS) out[k] = mergeDefined((DEFAULT_CONTENT as any)[k], rows[k]);
  return out as SiteContent;
}

export async function saveContent(key: string, value: any, isPublic = true) {
  const { error } = await sb().from('site_content').upsert({ key, value, is_public: isPublic }, { onConflict: 'key' });
  if (error) throw error;
}

export async function loadPrivate<T = any>(key: string): Promise<T | null> {
  const { data } = await sb().from('site_content').select('value').eq('key', key).maybeSingle();
  return (data?.value as T) ?? null;
}

export async function loadHistory(key: string) {
  const { data, error } = await sb().from('site_content_history').select('*').eq('key', key)
    .order('changed_at', { ascending: false }).limit(15);
  if (error) throw error;
  return data || [];
}

/* ---------------- media ---------------- */

async function compressImage(file: File, maxDim: number, quality: number): Promise<Blob | File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 400 * 1024) return file;
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob: Blob | null = await new Promise(r => canvas.toBlob(r, 'image/webp', quality));
    return blob && blob.size < file.size ? blob : file;
  } catch { return file; }
}

const slug = (s: string) => s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file';

/** Uploads to the public "site-media" bucket and returns the public URL. Images are resized + converted to WebP. */
export async function uploadMedia(file: File, folder = 'uploads', opts: { maxDim?: number; quality?: number } = {}): Promise<string> {
  const body = await compressImage(file, opts.maxDim ?? 2000, opts.quality ?? 0.82);
  const ext = body instanceof File ? (file.name.split('.').pop() || 'bin').toLowerCase()
    : 'webp';
  const contentType = body instanceof File ? file.type : 'image/webp';
  const path = `${folder}/${Date.now()}-${slug(file.name)}.${ext}`;
  const { error } = await sb().storage.from(BUCKET).upload(path, body, { contentType, cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return sb().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/* ---------------- table helpers ---------------- */

export async function listRows(table: string, orderBy?: { col: string; asc?: boolean }, limit = 500) {
  let q = sb().from(table).select('*').limit(limit);
  if (orderBy) q = q.order(orderBy.col, { ascending: orderBy.asc ?? true });
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function saveRow(table: string, row: Record<string, any>) {
  const { id, ...rest } = row;
  const clean: Record<string, any> = {};
  Object.keys(rest).forEach(k => { if (rest[k] !== undefined) clean[k] = rest[k] === '' ? null : rest[k]; });
  if (id !== undefined && id !== null && id !== '') {
    const { error } = await sb().from(table).update(clean).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await sb().from(table).insert([clean]);
    if (error) throw error;
  }
}

export async function deleteRow(table: string, id: any) {
  const { error } = await sb().from(table).delete().eq('id', id);
  if (error) throw error;
}

export async function countRows(table: string, filter?: (q: any) => any): Promise<number> {
  let q: any = sb().from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

/** Ask the host (Vercel / Netlify / Cloudflare) to rebuild so the pre-rendered SEO pages, sitemap and llms.txt refresh. */
export async function triggerRebuild(hookUrl: string) {
  await fetch(hookUrl, { method: 'POST', mode: 'no-cors' });
}
