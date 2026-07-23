import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useCrud } from '@/hooks/useCrud'
import { Button, Input, EmptyState, Badge } from '@/components/ui/primitives'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { CrudForm } from '@/components/crud/CrudForm'
import type { ModuleConfig } from '@/config/fieldTypes'

export function CrudPage<T extends { id: string }>({ config }: { config: ModuleConfig<T> }) {
  const { list, create, update, remove } = useCrud<T>(config.table, config.order)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, any>>(config.emptyDefaults)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const rows = list.data ?? []

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) =>
      config.columns.some((c) => String((r as any)[c.key]).toLowerCase().includes(q))
    )
  }, [rows, search, config.columns])

  function openCreate() {
    setEditingId(null)
    setValues(config.emptyDefaults)
    setModalOpen(true)
  }

  function openEdit(row: T) {
    setEditingId(row.id)
    setValues({ ...row })
    setModalOpen(true)
  }

  async function handleSave() {
    if (editingId) {
      await update.mutateAsync({ id: editingId, payload: values as Partial<T> })
    } else {
      await create.mutateAsync(values as Partial<T>)
    }
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
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{config.title}</h1>
          <p className="text-sm text-neutral-500">{config.description}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
        <Search className="h-4 w-4 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400 dark:text-neutral-100"
        />
      </div>

      {list.isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing here yet" description={`Click "Add New" to create the first ${config.title.toLowerCase()} entry.`} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                {config.columns.map((c) => (
                  <th key={String(c.key)} className="px-4 py-3 font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((row) => (
                <tr key={row.id} className="bg-white hover:bg-neutral-50 dark:bg-neutral-950 dark:hover:bg-neutral-900">
                  {config.columns.map((c) => (
                    <td key={String(c.key)} className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {renderCell((row as any)[c.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(row)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-maroon-600 dark:hover:bg-neutral-800">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteId(row.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? `Edit ${config.title}` : `Add ${config.title}`} wide>
        <CrudForm fields={config.fields} values={values} onChange={(name, v) => setValues((prev) => ({ ...prev, [name]: v }))} />
        <div className="mt-4 flex justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={create.isPending || update.isPending}>
            Save
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this entry?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

function renderCell(value: any) {
  if (typeof value === 'boolean') return <Badge tone={value ? 'success' : 'neutral'}>{value ? 'Active' : 'Inactive'}</Badge>
  if (typeof value === 'string' && (value.startsWith('http') && /\.(jpg|jpeg|png|webp|gif)$/i.test(value))) {
    return <img src={value} alt="" className="h-10 w-10 rounded-lg object-cover" />
  }
  return String(value ?? '—')
}
