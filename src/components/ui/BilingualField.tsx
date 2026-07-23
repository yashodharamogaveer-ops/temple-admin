import { Input, Textarea, Label } from '@/components/ui/primitives'

interface BilingualFieldProps {
  label: string
  knValue: string
  enValue: string
  onKnChange: (v: string) => void
  onEnChange: (v: string) => void
  multiline?: boolean
  required?: boolean
  rows?: number
}

/**
 * Renders a single content field as a Kannada + English pair, side by side.
 * This is the canonical bilingual editing pattern used on every module
 * (Seva, Events, History, Committee, Notifications, Temple Profile, Media captions).
 * Kannada is always shown first since it is the site's default language.
 */
export function BilingualField({
  label,
  knValue,
  enValue,
  onKnChange,
  onEnChange,
  multiline = false,
  required = false,
  rows = 4,
}: BilingualFieldProps) {
  const Field = multiline ? Textarea : Input

  return (
    <div className="mb-5">
      <Label>
        {label} {required && <span className="text-maroon-600">*</span>}
      </Label>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <span className="mb-1 inline-block rounded bg-saffron-100 px-1.5 py-0.5 text-[11px] font-semibold text-saffron-800">
            ಕನ್ನಡ (Kannada)
          </span>
          <Field
            value={knValue}
            onChange={(e) => onKnChange(e.target.value)}
            rows={multiline ? rows : undefined}
            className="font-display"
            placeholder={`${label} in Kannada`}
          />
        </div>
        <div>
          <span className="mb-1 inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            English
          </span>
          <Field
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            rows={multiline ? rows : undefined}
            placeholder={`${label} in English`}
          />
        </div>
      </div>
    </div>
  )
}
