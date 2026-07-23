import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import type { AdminProfile, AdminRole } from '@/types'
import { Button, Input, Label, Badge, EmptyState } from '@/components/ui/primitives'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { Plus, ShieldCheck, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('admin_profiles').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data as AdminProfile[]
    },
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ email: '', full_name: '', role: 'admin' as AdminRole })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const invite = useMutation({
    mutationFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Invite failed')
    },
    onSuccess: () => {
      toast.success('Invitation sent')
      qc.invalidateQueries({ queryKey: ['admin_profiles'] })
      setModalOpen(false)
      setForm({ email: '', full_name: '', role: 'admin' })
    },
    onError: (e: any) => toast.error(e.message),
  })

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('admin_profiles').update({ is_active }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin_profiles'] }),
  })

  const changeRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: AdminRole }) => {
      const { error } = await supabase.from('admin_profiles').update({ role }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin_profiles'] }),
  })

  const removeAdmin = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('admin_profiles').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin_profiles'] })
      toast.success('Admin removed')
    },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Admin Users</h1>
          <p className="text-sm text-neutral-500">Super Admin only — manage who can access this panel.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Invite Admin
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : !data?.length ? (
        <EmptyState title="No admins yet" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {data.map((admin) => (
                <tr key={admin.id} className="bg-white dark:bg-neutral-950">
                  <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="inline-flex items-center gap-1.5">
                      {admin.role === 'super_admin' && <ShieldCheck className="h-3.5 w-3.5 text-maroon-600" />}
                      {admin.full_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{admin.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={admin.role}
                      onChange={(e) => changeRole.mutate({ id: admin.id, role: e.target.value as AdminRole })}
                      className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
                    >
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive.mutate({ id: admin.id, is_active: !admin.is_active })}>
                      <Badge tone={admin.is_active ? 'success' : 'danger'}>{admin.is_active ? 'Active' : 'Disabled'}</Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(admin.id)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:hover:bg-neutral-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite New Admin">
        <div className="mb-4">
          <Label>Full Name</Label>
          <Input value={form.full_name} onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))} />
        </div>
        <div className="mb-4">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        </div>
        <div className="mb-4">
          <Label>Role</Label>
          <select
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as AdminRole }))}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <p className="mb-4 text-xs text-neutral-500">An invitation email will be sent via Supabase Auth so they can set their own password.</p>
        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => invite.mutate()} loading={invite.isPending}>
            Send Invite
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove this admin?"
        description="They will immediately lose access to the panel."
        onConfirm={() => {
          if (deleteId) removeAdmin.mutate(deleteId)
          setDeleteId(null)
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
