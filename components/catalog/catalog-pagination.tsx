'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CatalogPaginationProps {
  page: number
  totalPages: number
}

export function CatalogPagination({ page, totalPages }: CatalogPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(target: number) {
    const params = new URLSearchParams(searchParams.toString())
    if (target <= 1) params.delete('page')
    else params.set('page', String(target))
    router.push(`${pathname}?${params.toString()}`, { scroll: true })
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      className="flex items-center justify-center gap-2 pt-12"
      aria-label="Paginación"
    >
      <button
        type="button"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => goToPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={cn(
            'flex size-9 items-center justify-center rounded-full border text-sm transition-colors',
            p === page
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        aria-label="Página siguiente"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
