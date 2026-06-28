import { StoreForm } from '@/components/admin/store-form'
import { getStoreConfig } from '@/services/store-service'

export default async function AdminStorePage() {
  const store = await getStoreConfig()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl text-foreground">
          Configuración de la tienda
        </h1>
        <p className="text-sm text-muted-foreground">
          Estos datos se muestran en todo el sitio: header, footer, contacto.
        </p>
      </div>

      <StoreForm store={store} />
    </div>
  )
}
