import { CrudPage } from '@/components/crud/CrudPage'
import { eventsConfig } from '@/config/modules'
import type { EventItem } from '@/types'

export default function Events() {
  return <CrudPage<EventItem> config={eventsConfig} />
}
