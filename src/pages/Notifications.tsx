import { CrudPage } from '@/components/crud/CrudPage'
import { notificationsConfig } from '@/config/modules'
import type { NotificationItem } from '@/types'

export default function Notifications() {
  return <CrudPage<NotificationItem> config={notificationsConfig} />
}
