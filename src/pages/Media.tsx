import { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import type { MediaItem, MediaKind } from '@/types'
import { Button, Input, EmptyState } from '@/components/ui/primitives'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { BilingualField } from '@/components/ui/BilingualField'
import { FileDropField } from '@/components/ui/FileDropField'
import { cn } from '@/lib/cn'

const EMPTY: Partial<MediaItem> = {
  kind: 'image', url: '', caption_kn: '', caption_en: '', alt_text_kn: '', alt_text_en: '', album: 'general', sort_order: 0,
}

export default function Media() {
  const { list, create, update, remove } = useCrud<MediaItem>('media_items', { column: 'sort_order', ascending: true })
  const [tab, setTab] = useState<MediaKind>('image')
  const [album, setAlbum] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [values, setValues] = useState<Partial<MediaItem>>(EMPTY)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const rows = list.data ?? []
  const albums = ['all', ...Array.from(new Set(rows.map((r) => r.album)))]
  const filtered = rows.filter((r) => r.kind === tab && (album === 'all' || r.album === album))

  function openCreate() {
    setEditingId(null)
    setValues({ ...EMPTY, kind: tab })
    setModalOpen(true)
  }

  function openEdit(row: MediaItem) {
    setEditingId(row.id)
    setValues(row)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!values.url) return
    if (editingId) await update.mutateAsync({ id: editingId, payload: values })
    else await create.mutateAsync(values)
    setModalOpen(false)
  }

  async function handleDelete() {
    if (deleteId) await remove.mutateAsync(deleteId)
    setDeleteId(null)
  }

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Images & Videos</h1>
          <p className="text-sm text-neutral-500">Media library backed by Supabase Storage.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Upload
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        {(['image', 'video'] as MediaKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium capitalize',
              tab === k ? 'bg-maroon-600 text-white' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
            )}
          >
            {k}s
          </button>
        ))}
        <select value={album} onChange={(e) => setAlbum(e.target.value)} className="ml-2 rounded-full border border-neutral-200 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900">
          {albums.map((a) => (
            <option key={a} value={a}>
              {a === 'all' ? 'All Albums' : a}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={`No ${tab}s yet`} description="Click Upload to add your first item." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              {item.kind === 'image' ? (
                <img src={item.url} alt={item.alt_text_en} className="h-32 w-full object-cover" />
              ) : (
                <video src={item.url} className="h-32 w-full object-cover" />
              )}
              <div className="p-2">
                <p className="truncate text-xs font-medium text-neutral-700 dark:text-neutral-300">{item.caption_en || item.caption_kn || 'Untitled'}</p>
                <p className="truncate text-[11px] text-neutral-400">{item.album}</p>
              </div>
              <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => openEdit(item)} className="rounded-lg bg-white/90 p-1.5 text-neutral-600 shadow hover:text-maroon-600">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setDeleteId(item.id)} className="rounded-lg bg-white/90 p-1.5 text-neutral-600 shadow hover:text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Media' : 'Upload Media'}>
        <FileDropField
          label={tab === 'image' ? 'Image File' : 'Video File'}
          kind={values.kind ?? tab}
          folder="gallery"
          value={values.url ?? null}
          onChange={(url) => setValues((p) => ({ ...p, url }))}
        />
        <BilingualField
          label="Caption"
          knValue={values.caption_kn ?? ''}
          enValue={values.caption_en ?? ''}
          onKnChange={(v) => setValues((p) => ({ ...p, caption_kn: v }))}
          onEnChange={(v) => setValues((p) => ({ ...p, caption_en: v }))}
        />
        <BilingualField
          label="Alt Text"
          knValue={values.alt_text_kn ?? ''}
          enValue={values.alt_text_en ?? ''}
          onKnChange={(v) => setValues((p) => ({ ...p, alt_text_kn: v }))}
          onEnChange={(v) => setValues((p) => ({ ...p, alt_text_en: v }))}
        />
        <div className="mb-2">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Album</label>
          <Input value={values.album ?? 'general'} onChange={(e) => setValues((p) => ({ ...p, album: e.target.value }))} placeholder="e.g. gallery, homepage-slider" />
        </div>
        <div className="mt-4 flex justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={create.isPending || update.isPending}>
            Save
          </Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete this media item?" description="This will permanently remove the file reference." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  )
}
