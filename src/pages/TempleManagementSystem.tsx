import { Wallet, Package, Users2, Receipt, CalendarCheck, Sparkles, HeartHandshake, LayoutDashboard, BarChart3 } from 'lucide-react'
import { Card, Badge } from '@/components/ui/primitives'

const ROADMAP = [
  { icon: CalendarCheck, title: 'Online Seva Booking', desc: 'Devotees book sevas online with slot management, confirmations, and reminders.', phase: 'Phase 1' },
  { icon: HeartHandshake, title: 'Donation Management', desc: 'Online donations, donor records, 80G receipts, and campaign tracking.', phase: 'Phase 1' },
  { icon: Receipt, title: 'Seva Billing & Receipts', desc: 'Digital billing and printable/emailed receipts for every seva payment.', phase: 'Phase 1' },
  { icon: Wallet, title: 'Accounting', desc: 'Income, expense tracking, and financial statements.', phase: 'Phase 2' },
  { icon: Package, title: 'Inventory Management', desc: 'Track prasadam, pooja items, and temple stores.', phase: 'Phase 2' },
  { icon: Users2, title: 'Employee Management', desc: 'Staff records, duty rosters, and attendance.', phase: 'Phase 2' },
  { icon: LayoutDashboard, title: 'Temple CMS Integration', desc: 'Unified view linking operations data back into the website CMS.', phase: 'Phase 3' },
  { icon: BarChart3, title: 'Reporting & Analytics', desc: 'Donation trends, seva revenue, visitor footfall, and exportable reports.', phase: 'Phase 3' },
]

export default function TempleManagementSystem() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron-100 text-saffron-700">
        <Sparkles className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Temple Management System is coming soon.</h1>
      <p className="mt-2 max-w-md text-sm text-neutral-500">
        Day-to-day temple operations — seva booking, donations, billing, accounting, inventory,
        staff, and reporting — will live here, separate from the website CMS.
      </p>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
        {ROADMAP.map((r) => (
          <Card key={r.title} className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-maroon-600 dark:bg-neutral-800">
              <r.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{r.title}</p>
                <Badge>{r.phase}</Badge>
              </div>
              <p className="text-sm text-neutral-500">{r.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
