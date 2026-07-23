import { CrudPage } from '@/components/crud/CrudPage'
import { historyConfig } from '@/config/modules'
import type { HistoryEntry } from '@/types'

export default function History() {
  return <CrudPage<HistoryEntry> config={historyConfig} />
}
