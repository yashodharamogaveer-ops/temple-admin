import { useRef } from 'react'
import { ImagePlus, Loader2, X, Video } from 'lucide-react'
import { useFileUpload } from '@/hooks/useFileUpload'
import { Label } from '@/components/ui/primitives'

export function FileDropField({
  label,
  value,
  onChange,
  kind = 'image',
  folder = 'uploads',
}: {
  label: string
  value: string | null
  onChange: (url: string) => void
  kind?: 'image' | 'video'
  folder?: string
}) {
  const { upload, uploading } = useFileUpload()
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const url = await upload(file, folder)
    onChange(url)
  }

  return (
    <div className="mb-5">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept={kind === 'image' ? 'image/*' : 'video/*'}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {value ? (
        <div className="relative w-fit">
          {kind === 'image' ? (
            <img src={value} alt="" className="h-32 w-32 rounded-xl object-cover ring-1 ring-neutral-200 dark:ring-neutral-700" />
          ) : (
            <video src={value} className="h-32 w-56 rounded-xl object-cover ring-1 ring-neutral-200" controls />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-neutral-500 shadow ring-1 ring-neutral-200 hover:text-red-600"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-400 hover:border-maroon-400 hover:text-maroon-500 dark:border-neutral-700"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : kind === 'image' ? <ImagePlus className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          <span className="text-xs">{uploading ? 'Uploading…' : 'Upload'}</span>
        </button>
      )}
    </div>
  )
}
