"use client"

import { useState } from 'react'
import { Check, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { productToCartItem } from '@/lib/cart'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface AddToCartButtonProps {
  product: Product
  variant?: 'icon' | 'full'
  className?: string
}

export function AddToCartButton({ product, variant = 'full', className }: AddToCartButtonProps) {
  const { items, addItem } = useCart()
  const [added, setAdded] = useState(false)

  const inCartQty = items.find((i) => i.id === product.id)?.quantity ?? 0
  const soldOut = product.stock === 0
  const maxReached = !soldOut && inCartQty >= product.stock
  const disabled = soldOut || maxReached

  function handleClick(e: React.MouseEvent) {
    // Clave: el botón vive dentro de un <Link>, así que frenamos
    // la navegación y la propagación antes de que el <a> actúe.
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return

    addItem(productToCartItem(product))
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const label = soldOut
    ? 'Agotado'
    : maxReached
      ? 'Stock máximo en carrito'
      : added
        ? 'Agregado'
        : 'Agregar al carrito'

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={disabled ? label : `Agregar ${product.name} al carrito`}
        className={cn(
          'flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground',
          disabled && 'cursor-not-allowed opacity-50 hover:bg-background/90 hover:text-foreground',
          className,
        )}
      >
        {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90',
        disabled && 'cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted',
        className,
      )}
    >
      {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      {label}
    </button>
  )
}
