import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/primitives'
import { HandCoins, Images, CalendarDays, Users, Bell, ScrollText } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

async function countRows(table: string) {
  const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
  return count ?? 0
}

export default function Dashboard() {
  const { profile } = useAuth()

  const { data } = useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: async () => {
      const [sevas, media, events, committee, notifications, history] = await Promise.all([
        countRows('sevas'),
        countRows('media_items'),
        countRows('events'),
        countRows('committee_members'),
        countRows('notifications'),
        countRows('temple_history'),
      ])
      return { sevas, media, events, committee, notifications, history }
    },
  })

  const cards = [
    { label: 'Sevas', value: data?.sevas, icon: HandCoins, color: 'text-maroon-600' },
    { label: 'Media Items', value: data?.media, icon: Images, color: 'text-saffron-600' },
    { label: 'Events', value: data?.events, icon: CalendarDays, color: 'text-blue-600' },
    { label: 'Committee Members', value: data?.committee, icon: Users, color: 'text-green-600' },
    { label: 'Notifications', value: data?.notifications, icon: Bell, color: 'text-purple-600' },
    { label: 'History Entries', value: data?.history, icon: ScrollText, color: 'text-orange-600' },
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Admin'}
      </h1>
      <p className="mb-6 text-sm text-neutral-500">Here's what's happening on the temple website.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="flex items-center gap-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{c.value ?? '—'}</p>
              <p className="text-sm text-neutral-500">{c.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
