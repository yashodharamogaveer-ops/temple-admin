import { CrudPage } from '@/components/crud/CrudPage'
import { committeeConfig } from '@/config/modules'
import type { CommitteeMember } from '@/types'

export default function Committee() {
  return <CrudPage<CommitteeMember> config={committeeConfig} />
}
