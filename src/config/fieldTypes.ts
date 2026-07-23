export type FieldConfig =
  | { type: 'bilingual-text'; base: string; label: string; required?: boolean }
  | { type: 'bilingual-textarea'; base: string; label: string; rows?: number }
  | { type: 'text'; name: string; label: string; required?: boolean; placeholder?: string }
  | { type: 'number'; name: string; label: string }
  | { type: 'date'; name: string; label: string; required?: boolean }
  | { type: 'time'; name: string; label: string }
  | { type: 'select'; name: string; label: string; options: { value: string; label: string }[] }
  | { type: 'boolean'; name: string; label: string }
  | { type: 'image'; name: string; label: string; folder: string }
  | { type: 'video'; name: string; label: string; folder: string }

export interface ModuleConfig<T> {
  table: string
  title: string
  description: string
  columns: { key: keyof T | string; label: string }[]
  fields: FieldConfig[]
  order: { column: string; ascending?: boolean }
  emptyDefaults: Record<string, any>
}
