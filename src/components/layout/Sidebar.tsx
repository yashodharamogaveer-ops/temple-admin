import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Landmark, HandCoins, Images, CalendarDays,
  ScrollText, Users, Bell, ShieldCheck, LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/temple-profile', label: 'Temple Profile', icon: Landmark },
  { to: '/sevas', label: 'Seva Management', icon: HandCoins },
  { to: '/media', label: 'Images & Videos', icon: Images },
  { to: '/history', label: 'Temple History', icon: ScrollText },
  { to: '/events', label: 'Events & Festivals', icon: CalendarDays },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/committee', label: 'Committee Members', icon: Users },
]

export function Sidebar() {
  const { profile, isSuperAdmin, signOut } = useAuth()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-2 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-maroon-600 text-white">
          <Landmark className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Temple Admin</p>
          <p className="text-xs text-neutral-500">ದೇವಸ್ಥಾನ ಫಲಕ</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-maroon-50 text-maroon-700 dark:bg-maroon-950 dark:text-maroon-200'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}

        {isSuperAdmin && (
          <NavLink
            to="/admin-users"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-maroon-50 text-maroon-700 dark:bg-maroon-950 dark:text-maroon-200'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900'
              )
            }
          >
            <ShieldCheck className="h-4 w-4" />
            Admin Users
          </NavLink>
        )}

        <NavLink
          to="/temple-management-system"
          className={({ isActive }) =>
            cn(
              'mt-4 flex flex-col rounded-xl bg-saffron-50 px-3 py-3 transition-colors hover:bg-saffron-100',
              isActive && 'ring-2 ring-saffron-400'
            )
          }
        >
          <p className="text-xs font-semibold text-saffron-800">Temple Management System</p>
          <p className="mt-0.5 text-[11px] text-saffron-700">Coming soon — operations module</p>
        </NavLink>
      </nav>

      <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
        <div className="mb-2 px-2">
          <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">{profile?.full_name}</p>
          <p className="truncate text-xs text-neutral-500">
            {profile?.email} · <span className="uppercase">{profile?.role.replace('_', ' ')}</span>
          </p>
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}
