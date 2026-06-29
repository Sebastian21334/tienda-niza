'use client'

import { useState } from 'react'
import { upload } from '@vercel/blob/client'

export interface UploadedImage {
  url: string
  name: string
}

interface ImageUploaderProps {
  /** Imágenes actuales (controlado desde el padre) */
  images: UploadedImage[]
  /** Se llama cada vez que cambia la lista (subida nueva o borrado) */
  onChange: (images: UploadedImage[]) => void
  /** Si se pasa, renderiza un <input type="hidden"> con este name y las URLs
   *  separadas por salto de línea — útil para formularios con Server Action. */
  name?: string
  /** Permitir más de una imagen por vez. Default: true */
  multiple?: boolean
  /** Cantidad máxima de imágenes. Si no se pasa, no hay límite. */
  maxImages?: number
  /** Tamaño máximo por archivo, en MB. Default: 4 */
  maxFileSizeMB?: number
  /** Carpeta dentro del Blob Store para organizar (ej: "products", "homepage") */
  folder?: string
  /** Texto del label. Default: "Imágenes" */
  label?: string
  /** Separador usado al unir las URLs en el input oculto. Default: '\n' (salto de línea).
   *  Usar ', ' si el Server Action espera las rutas separadas por coma. */
  separator?: string
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

  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const fileList = Array.from(files)

      if (maxImages && images.length + fileList.length > maxImages) {
        throw new Error(
          `Solo se permiten hasta ${maxImages} imagen${maxImages > 1 ? 'es' : ''}. ` +
            `Ya tenés ${images.length} y estás intentando agregar ${fileList.length}.`,
        )
      }

      const tooBig = fileList.filter((f) => f.size > maxFileSizeBytes)
      if (tooBig.length > 0) {
        const names = tooBig
          .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`)
          .join(', ')
        throw new Error(
          `Las siguientes imágenes superan el límite de ${maxFileSizeMB}MB: ${names}. Comprimilas antes de subirlas.`,
        )
      }

      const newImages: UploadedImage[] = []

      for (const file of fileList) {
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
