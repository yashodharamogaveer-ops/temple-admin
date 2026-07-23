import type { FieldConfig } from '@/config/fieldTypes'
import { BilingualField } from '@/components/ui/BilingualField'
import { Input, Label } from '@/components/ui/primitives'
import { FileDropField } from '@/components/ui/FileDropField'

interface CrudFormProps {
  fields: FieldConfig[]
  values: Record<string, any>
  onChange: (name: string, value: any) => void
}

/**
 * Renders any module's edit form purely from its field config.
 * Adding a new module = writing a config array, not a new form component.
 */
export function CrudForm({ fields, values, onChange }: CrudFormProps) {
  return (
    <div>
      {fields.map((f, idx) => {
        switch (f.type) {
          case 'bilingual-text':
            return (
              <BilingualField
                key={idx}
                label={f.label}
                required={f.required}
                knValue={values[`${f.base}_kn`] ?? ''}
                enValue={values[`${f.base}_en`] ?? ''}
                onKnChange={(v) => onChange(`${f.base}_kn`, v)}
                onEnChange={(v) => onChange(`${f.base}_en`, v)}
              />
            )
          case 'bilingual-textarea':
            return (
              <BilingualField
                key={idx}
                label={f.label}
                multiline
                rows={f.rows ?? 4}
                knValue={values[`${f.base}_kn`] ?? ''}
                enValue={values[`${f.base}_en`] ?? ''}
                onKnChange={(v) => onChange(`${f.base}_kn`, v)}
                onEnChange={(v) => onChange(`${f.base}_en`, v)}
              />
            )
          case 'text':
            return (
              <div className="mb-5" key={idx}>
                <Label>
                  {f.label} {f.required && <span className="text-maroon-600">*</span>}
                </Label>
                <Input
                  value={values[f.name] ?? ''}
                  placeholder={f.placeholder}
                  onChange={(e) => onChange(f.name, e.target.value)}
                />
              </div>
            )
          case 'number':
            return (
              <div className="mb-5" key={idx}>
                <Label>{f.label}</Label>
                <Input
                  type="number"
                  value={values[f.name] ?? 0}
                  onChange={(e) => onChange(f.name, Number(e.target.value))}
                />
              </div>
            )
          case 'date':
            return (
              <div className="mb-5" key={idx}>
                <Label>
                  {f.label} {f.required && <span className="text-maroon-600">*</span>}
                </Label>
                <Input type="date" value={values[f.name] ?? ''} onChange={(e) => onChange(f.name, e.target.value)} />
              </div>
            )
          case 'time':
            return (
              <div className="mb-5" key={idx}>
                <Label>{f.label}</Label>
                <Input type="time" value={values[f.name] ?? ''} onChange={(e) => onChange(f.name, e.target.value)} />
              </div>
            )
          case 'select':
            return (
              <div className="mb-5" key={idx}>
                <Label>{f.label}</Label>
                <select
                  value={values[f.name] ?? f.options[0]?.value}
                  onChange={(e) => onChange(f.name, e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )
          case 'boolean':
            return (
              <label key={idx} className="mb-5 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!values[f.name]}
                  onChange={(e) => onChange(f.name, e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-maroon-600 focus:ring-maroon-500"
                />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{f.label}</span>
              </label>
            )
          case 'image':
            return (
              <FileDropField
                key={idx}
                label={f.label}
                kind="image"
                folder={f.folder}
                value={values[f.name] ?? null}
                onChange={(url) => onChange(f.name, url)}
              />
            )
          case 'video':
            return (
              <FileDropField
                key={idx}
                label={f.label}
                kind="video"
                folder={f.folder}
                value={values[f.name] ?? null}
                onChange={(url) => onChange(f.name, url)}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}
