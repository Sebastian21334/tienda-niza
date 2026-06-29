'use client'

import { useActionState, useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateStoreAction } from '@/app/admin/(panel)/tienda/store-actions'
import type { StoreConfig } from '@/types'
import { ImageUploader, type UploadedImage } from './ImageUploader'

export function StoreForm({ store }: { store: StoreConfig }) {
  const [state, formAction, pending] = useActionState(updateStoreAction, undefined)

  const [heroImages, setHeroImages] = useState<UploadedImage[]>(
    store.heroImage ? [{ url: store.heroImage, name: 'hero' }] : [],
  )
  const [aboutImages, setAboutImages] = useState<UploadedImage[]>(
    store.aboutImage ? [{ url: store.aboutImage, name: 'about' }] : [],
  )

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Nombre de la tienda
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={store.name}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="logo" className="text-sm font-medium text-foreground">
            Logo (ruta de imagen, opcional)
          </label>
          <input
            id="logo"
            name="logo"
            type="text"
            placeholder="/images/logo.png"
            defaultValue={store.logo}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="slogan" className="text-sm font-medium text-foreground">
            Slogan
          </label>
          <input
            id="slogan"
            name="slogan"
            type="text"
            defaultValue={store.slogan}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={store.description}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
            WhatsApp (con código de país, sin +)
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="text"
            placeholder="5491122334455"
            defaultValue={store.whatsapp}
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="instagram" className="text-sm font-medium text-foreground">
            Instagram (usuario, sin @)
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            defaultValue={store.instagram}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="facebook" className="text-sm font-medium text-foreground">
            Facebook (usuario/página)
          </label>
          <input
            id="facebook"
            name="facebook"
            type="text"
            defaultValue={store.facebook}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-foreground">
            Dirección
          </label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={store.address}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="hours" className="text-sm font-medium text-foreground">
            Horarios
          </label>
          <input
            id="hours"
            name="hours"
            type="text"
            defaultValue={store.hours}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="footerInfo" className="text-sm font-medium text-foreground">
            Texto del footer
          </label>
          <textarea
            id="footerInfo"
            name="footerInfo"
            rows={2}
            defaultValue={store.footerInfo}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ImageUploader
          images={heroImages}
          onChange={setHeroImages}
          name="heroImage"
          folder="homepage"
          multiple={false}
          maxImages={1}
          label="Imagen principal (Hero)"
        />

        <ImageUploader
          images={aboutImages}
          onChange={setAboutImages}
          name="aboutImage"
          folder="homepage"
          multiple={false}
          maxImages={1}
          label="Imagen 'Sobre nosotros'"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          Cambios guardados correctamente.
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  )
}
