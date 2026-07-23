import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { BilingualField } from '@/components/ui/BilingualField'
import { Button, Input, Label, Card } from '@/components/ui/primitives'
import { FileDropField } from '@/components/ui/FileDropField'
import type { TemplePreset } from '@/types'
import toast from 'react-hot-toast'

export default function TempleProfile() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['temple_profile'],
    queryFn: async () => {
      const { data, error } = await supabase.from('temple_profile').select('*').single()
      if (error) throw error
      return data as TemplePreset
    },
  })

  const [form, setForm] = useState<Partial<TemplePreset>>({})

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const save = useMutation({
    mutationFn: async () => {
      const { id, ...payload } = form
      const { error } = await supabase.from('temple_profile').update(payload).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Temple profile updated')
      qc.invalidateQueries({ queryKey: ['temple_profile'] })
    },
    onError: (err: any) => toast.error(err.message),
  })

  if (isLoading) return <p className="text-sm text-neutral-500">Loading…</p>

  const set = (k: keyof TemplePreset, v: any) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Temple Profile</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Core details shown across the website — name, address, and contact information.
      </p>

      <Card className="max-w-3xl">
        <FileDropField label="Temple Logo" kind="image" folder="logo" value={form.logo_url ?? null} onChange={(url) => set('logo_url', url)} />

        <BilingualField
          label="Temple Name"
          knValue={form.name_kn ?? ''}
          enValue={form.name_en ?? ''}
          onKnChange={(v) => set('name_kn', v)}
          onEnChange={(v) => set('name_en', v)}
          required
        />

        <BilingualField
          label="Address"
          multiline
          knValue={form.address_kn ?? ''}
          enValue={form.address_en ?? ''}
          onKnChange={(v) => set('address_kn', v)}
          onEnChange={(v) => set('address_en', v)}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Phone</Label>
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <Label>Alternate Phone</Label>
            <Input value={form.alt_phone ?? ''} onChange={(e) => set('alt_phone', e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <Label>WhatsApp Number</Label>
            <Input value={form.whatsapp ?? ''} onChange={(e) => set('whatsapp', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Google Maps Link</Label>
            <Input value={form.map_link ?? ''} onChange={(e) => set('map_link', e.target.value)} />
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <Button onClick={() => save.mutate()} loading={save.isPending}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  )
}
