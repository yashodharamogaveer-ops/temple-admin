import { CrudPage } from '@/components/crud/CrudPage'
import { sevaConfig } from '@/config/modules'
import type { Seva } from '@/types'

export default function Sevas() {
  return <CrudPage<Seva> config={sevaConfig} />
}
