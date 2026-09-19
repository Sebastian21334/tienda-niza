'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Category, SortOption } from '@/types'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Destacados' },
  { value: 'newest', label: 'Novedades' },
  { value: 'best-selling', label: 'Más vendidos' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
]

interface CatalogToolbarProps {
  categories: Category[]
  total: number
  showingFrom: number
  showingTo: number
}

export function CatalogToolbar({
  categories,
  total,
  showingFrom,
  showingTo,
}: CatalogToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const activeCategory = searchParams.get('category') ?? 'all'
  const activeSort = (searchParams.get('sort') as SortOption) ?? 'featured'
  const [searchValue, setSearchValue] = useState(searchParams.get('search') ?? '')

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '' || value === 'all') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      // Any filter change resets pagination
      if (!('page' in updates)) params.delete('page')
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  // Debounce search input -> URL
  useEffect(() => {
    const current = searchParams.get('search') ?? ''
    if (searchValue === current) return
    const id = setTimeout(() => updateParams({ search: searchValue }), 350)
    return () => clearTimeout(id)
  }, [searchValue, searchParams, updateParams])

  const tabs = [{ slug: 'all', name: 'Todo' }, ...categories]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Buscar joyas, materiales..."
            className="rounded-full border-border bg-card pl-9"
            aria-label="Buscar productos"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Ordenar por
          </span>
          <Select
            value={activeSort}
            onValueChange={(value) => updateParams({ sort: value })}
          >
            <SelectTrigger className="w-[200px] rounded-full bg-card">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <span className="flex-1 text-left">
                {SORT_OPTIONS.find((option) => option.value === activeSort)?.label ?? 'Destacados'}
              </span>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = activeCategory === tab.slug
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => updateParams({ category: tab.slug })}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground',
                )}
              >
                {tab.name}
              </button>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? 'Sin resultados'
            : `Mostrando ${showingFrom}–${showingTo} de ${total}`}
        </p>
      </div>
    </div>
  )
}
