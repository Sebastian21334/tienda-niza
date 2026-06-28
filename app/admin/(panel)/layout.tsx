import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar email={session.email} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
