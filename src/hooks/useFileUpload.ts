import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const BUCKET = 'temple-media'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)

  async function upload(file: File, folder = 'uploads'): Promise<string> {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${folder}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (error) throw error
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      return data.publicUrl
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
