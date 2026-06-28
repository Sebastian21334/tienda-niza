import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { WhatsappFloat } from '@/components/site/whatsapp-float'
import { getCategories } from '@/services/category-service'
import { getStoreConfig } from '@/services/store-service'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [store, categories] = await Promise.all([
    getStoreConfig(),
    getCategories(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        storeName={store.name}
        whatsapp={store.whatsapp}
        instagram={store.instagram}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter store={store} categories={categories} />
      <WhatsappFloat whatsapp={store.whatsapp} storeName={store.name} />
    </div>
  )
}
