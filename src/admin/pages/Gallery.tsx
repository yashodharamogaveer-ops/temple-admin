import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Film, ImagePlus, Pencil } from 'lucide-react';
import { deleteRow, errMsg, listRows, saveRow, uploadMedia } from '../api';
import { BiText, Button, ConfirmButton, Empty, Loading, Modal, PageHeader, Spinner, Tabs, useToast, ImageField } from '../ui';

const URL_FIELDS = ['url', 'src', 'image_url', 'video_url', 'media_url'];
const urlField = (r: any) => URL_FIELDS.find(f => r[f]) || 'url';
const urlOf = (r: any) => r[urlField(r)] as string | undefined;
const isVideo = (r: any) => r.kind === 'video' || r.type === 'video' || /\.(mp4|webm|ogg)(\?|$)/i.test(urlOf(r) || '');

export default function GalleryPage() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [tab, setTab] = useState<'image' | 'video'>('image');
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const load = useCallback(async () => {
    try { setRows(await listRows('media_items', { col: 'created_at', asc: false })); }
    catch (e) { push('err', errMsg(e)); setRows([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    let done = 0;
    for (const f of Array.from(files)) {
      setBusy(`Uploading ${++done} of ${files.length}…`);
      try {
        const url = await uploadMedia(f, 'gallery', { maxDim: 2000 });
        await saveRow('media_items', { kind: f.type.startsWith('video') ? 'video' : 'image', url });
      } catch (e) { push('err', `${f.name}: ${errMsg(e)}`); }
    }
    setBusy(null); if (input.current) input.current.value = '';
    push('ok', 'Gallery updated'); load();
  };

  const shown = (rows || []).filter(r => (tab === 'video') === isVideo(r));
  const saveEdit = async () => {
    try {
      const f = urlField(editing);
      await saveRow('media_items', { id: editing.id, caption_en: editing.caption_en, caption_kn: editing.caption_kn, thumbnail_url: editing.thumbnail_url, [f]: editing[f] });
      setEditing(null); push('ok', 'Saved'); load();
    } catch (e) { push('err', errMsg(e)); }
  };

  return (
    <div>
      <PageHeader title="Gallery" subtitle="Photos and videos for the Gallery page. Large photos are resized automatically so the site stays fast."
        actions={<Button onClick={() => input.current?.click()} loading={!!busy}><ImagePlus className="w-4 h-4" /> Upload files</Button>} />
      <input ref={input} type="file" multiple accept="image/*,video/mp4,video/webm" className="hidden" onChange={e => upload(e.target.files)} />
      {busy && <div className="mb-4 flex items-center gap-2 text-sm text-stone-600"><Spinner className="w-4 h-4" /> {busy}</div>}
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'image', label: 'Photos' }, { id: 'video', label: 'Videos' }]} />
      {rows === null ? <Loading /> : shown.length === 0 ? (
        <Empty icon={<Film className="w-6 h-6" />} title={`No ${tab}s yet`} hint="Tap “Upload files” — you can pick many at once." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {shown.map(r => (
            <div key={r.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col">
              <div className="aspect-square bg-stone-100">
                {isVideo(r) ? <video src={urlOf(r)} className="w-full h-full object-cover" muted preload="metadata" /> : <img src={urlOf(r)} alt="" loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <div className="p-2.5 flex-1 flex flex-col gap-2">
                <p className="text-xs text-stone-600 line-clamp-2 min-h-[2rem]">{r.caption_en || r.caption_kn || <span className="text-stone-400">No caption</span>}</p>
                <div className="flex gap-1 mt-auto">
                  <Button size="sm" variant="secondary" className="flex-1" onClick={() => setEditing({ ...r })}><Pencil className="w-3 h-3" /> Edit</Button>
                  <ConfirmButton label="" confirmLabel="Sure?" onConfirm={async () => { await deleteRow('media_items', r.id); load(); }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!editing} title="Edit gallery item" onClose={() => setEditing(null)}
        footer={<><Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={saveEdit}>Save</Button></>}>
        {editing && (
          <div className="space-y-5">
            <BiText label="Caption" kn={editing.caption_kn} en={editing.caption_en} onKn={v => setEditing({ ...editing, caption_kn: v })} onEn={v => setEditing({ ...editing, caption_en: v })} multiline rows={2} />
            {isVideo(editing) && <ImageField label="Video cover image (optional)" value={editing.thumbnail_url} folder="gallery" onChange={v => setEditing({ ...editing, thumbnail_url: v })} />}
          </div>
        )}
      </Modal>
    </div>
  );
}
