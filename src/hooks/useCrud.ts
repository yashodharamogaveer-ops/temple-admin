import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import toast from 'react-hot-toast'

interface OrderOpt {
  column: string
  ascending?: boolean
}

/**
 * Generic CRUD hook for any Supabase table.
 * Every content module (sevas, events, history, committee, media, notifications...)
 * reuses this single hook instead of duplicating fetch/insert/update/delete logic.
 */
export function useCrud<T extends { id: string }>(table: string, order: OrderOpt = { column: 'created_at', ascending: false }) {
  const qc = useQueryClient()
  const key = [table]

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(order.column, { ascending: order.ascending ?? false })
      if (error) throw error
      return data as T[]
    },
  })

  const create = useMutation({
    mutationFn: async (payload: Partial<T>) => {
      const { data, error } = await supabase.from(table).insert(payload as any).select().single()
      if (error) throw error
      return data as T
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key })
      toast.success('Created successfully')
    },
    onError: (err: any) => toast.error(err.message ?? 'Create failed'),
  })

  const update = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<T> }) => {
      const { data, error } = await supabase.from(table).update(payload as any).eq('id', id).select().single()
      if (error) throw error
      return data as T
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key })
      toast.success('Updated successfully')
    },
    onError: (err: any) => toast.error(err.message ?? 'Update failed'),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key })
      toast.success('Deleted')
    },
    onError: (err: any) => toast.error(err.message ?? 'Delete failed'),
  })

  const reorder = useMutation({
    mutationFn: async (items: { id: string; sort_order: number }[]) => {
      await Promise.all(
        items.map((i) => supabase.from(table).update({ sort_order: i.sort_order }).eq('id', i.id))
      )
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  return { list, create, update, remove, reorder }
}
