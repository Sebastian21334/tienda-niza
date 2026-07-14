'use client'

import { useState } from 'react'
import { upload } from '@vercel/blob/client'

export interface UploadedImage {
  url: string
  name: string
}

interface ImageUploaderProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  name?: string
  multiple?: boolean
  maxImages?: number
  maxFileSizeMB?: number
  folder?: string
  label?: string
  separator?: string
}

interface CompressionResult {
  file: File
  originalName: string
  originalSizeMB: number
  finalSizeMB: number
  compressed: boolean
  reason?: string
}

/** Redimensiona y comprime una imagen en el navegador antes de subirla */
async function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.8,
): Promise<CompressionResult> {
  const originalSizeMB = file.size / 1024 / 1024

  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalName: file.name,
      originalSizeMB,
      finalSizeMB: originalSizeMB,
      compressed: false,
      reason: 'Tipo de archivo no soportado para compresión',
    }
  }

  if (file.type === 'image/gif') {
    return {
      file,
      originalName: file.name,
      originalSizeMB,
      finalSizeMB: originalSizeMB,
      compressed: false,
      reason: 'Los GIF no se comprimen (podría romper la animación)',
    }
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return {
        file,
        originalName: file.name,
        originalSizeMB,
        finalSizeMB: originalSizeMB,
        compressed: false,
        reason: 'El navegador no soporta canvas para comprimir',
      }
    }

    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    )

    if (!blob) {
      return {
        file,
        originalName: file.name,
        originalSizeMB,
        finalSizeMB: originalSizeMB,
        compressed: false,
        reason: 'No se pudo generar la versión comprimida',
      }
    }

    const finalSizeMB = blob.size / 1024 / 1024

    if (blob.size >= file.size) {
      return {
        file,
        originalName: file.name,
        originalSizeMB,
        finalSizeMB: originalSizeMB,
        compressed: false,
        reason: 'La imagen ya estaba optimizada, se subió el original',
      }
    }

    const newName = file.name.replace(/\.[^.]+$/, '.webp')
    const compressedFile = new File([blob], newName, { type: 'image/webp' })

    return {
      file: compressedFile,
      originalName: file.name,
      originalSizeMB,
      finalSizeMB,
      compressed: true,
    }
  } catch {
    return {
      file,
      originalName: file.name,
      originalSizeMB,
      finalSizeMB: originalSizeMB,
      compressed: false,
      reason: 'Error al procesar la imagen, se subió el original',
    }
  }
}

export function ImageUploader({
  images,
  onChange,
  name,
  multiple = true,
  maxImages,
  maxFileSizeMB = 4,
  folder = 'uploads',
  label = 'Imágenes',
  separator = '\n',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult[]>([])

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)
    setCompressionInfo([])

    try {
      const fileList = Array.from(files)

      if (maxImages && images.length + fileList.length > maxImages) {
        throw new Error(
          `Solo se permiten hasta ${maxImages} imagen${maxImages > 1 ? 'es' : ''}. ` +
            `Ya tenés ${images.length} y estás intentando agregar ${fileList.length}.`,
        )
      }

      const results = await Promise.all(fileList.map((f) => compressImage(f)))
      setCompressionInfo(results)

      const compressedFiles = results.map((r) => r.file)

      const tooBig = compressedFiles.filter((f) => f.size > maxFileSizeBytes)
      if (tooBig.length > 0) {
        const names = tooBig
          .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`)
          .join(', ')
        throw new Error(
          `Las siguientes imágenes superan el límite de ${maxFileSizeMB}MB: ${names}. Comprimilas antes de subirlas.`,
        )
      }

      const newImages: UploadedImage[] = []

      for (const file of compressedFiles) {
        const blob = await upload(`${folder}/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        })
        newImages.push({ url: blob.url, name: file.name })
      }

      onChange([...images, ...newImages])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img.url !== url))
  }

  const reachedMax = maxImages !== undefined && images.length >= maxImages

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (máx. {maxFileSizeMB}MB por imagen{maxImages ? `, hasta ${maxImages} imagen${maxImages > 1 ? 'es' : ''}` : ''})
        </span>
      </label>

      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={uploading || reachedMax}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm disabled:opacity-50"
      />

      {uploading && (
        <p className="text-xs text-muted-foreground">Subiendo imagen(es)...</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      {reachedMax && !uploading && (
        <p className="text-xs text-muted-foreground">
          Llegaste al máximo de {maxImages} imagen{maxImages! > 1 ? 'es' : ''}. Borrá alguna para subir otra.
        </p>
      )}

      {!uploading && compressionInfo.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {compressionInfo.map((info) => (
            <p
              key={info.originalName}
              className={info.compressed ? 'text-xs text-green-600' : 'text-xs text-muted-foreground'}
            >
              {info.compressed
                ? `✓ ${info.originalName}: comprimida de ${info.originalSizeMB.toFixed(1)}MB a ${info.finalSizeMB.toFixed(1)}MB (${Math.round((1 - info.finalSizeMB / info.originalSizeMB) * 100)}% menos)`
                : `– ${info.originalName}: no se comprimió (${info.reason})`}
            </p>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-xs text-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {name && (
        <input type="hidden" name={name} value={images.map((i) => i.url).join(separator)} />
      )}
    </div>
  )
}