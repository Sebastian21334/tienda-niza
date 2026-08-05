"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/format'

const WHATSAPP_NUMBER = '5491122334455' // <-- poné tu número real (cod. país + número, sin +)

type ValidatedProduct = {
  id: string
  stock: number
  available: boolean
  price: number
}

export function CartDrawer() {
  const { items, removeItem, updateQuantity, syncStock, total, itemCount, clearCart } = useCart()
  const [checking, setChecking] = useState(false)

  /**
   * Consulta a la BD el stock/disponibilidad real de los productos que
   * están en el carrito, y ajusta lo que haga falta:
   * - Producto eliminado o no disponible -> se quita del carrito.
   * - Cantidad pedida mayor al stock real -> se recorta y se avisa.
   * - Si todo está bien, solo actualiza el stock cacheado para que los
   *   botones +/- reflejen el límite real.
   * Devuelve `true` si el carrito quedó sin cambios (todo OK).
   */
  async function validateStock(): Promise<boolean> {
    if (items.length === 0) return true

    setChecking(true)
    try {
      const res = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: items.map((i) => i.id) }),
      })

      if (!res.ok) {
        // Si falla la validación, no bloqueamos al usuario, pero tampoco
        // podemos garantizar que el stock esté al día.
        return true
      }

      const data: { products: ValidatedProduct[] } = await res.json()
      const byId = new Map(data.products.map((p) => [p.id, p]))
      let hadChanges = false

      for (const item of items) {
        const fresh = byId.get(item.id)

        if (!fresh || !fresh.available || fresh.stock === 0) {
          removeItem(item.id)
          toast.error(`"${item.name}" ya no está disponible y se quitó del carrito`)
          hadChanges = true
          continue
        }

        if (fresh.stock < item.quantity) {
          updateQuantity(item.id, fresh.stock)
          toast.warning(
            `Solo quedan ${fresh.stock} unidad${fresh.stock === 1 ? '' : 'es'} de "${item.name}", ajustamos la cantidad`
          )
          hadChanges = true
        }

        syncStock(item.id, fresh.stock)
      }

      return !hadChanges
    } catch {
      return true
    } finally {
      setChecking(false)
    }
  }

  function buildWhatsAppMessage() {
    const lines = items.map(
      (i) => `• ${i.quantity}x ${i.name} - ${formatPrice(i.price * i.quantity)}`,
    )
    const message = [
      '¡Hola! Quiero hacer este pedido:',
      '',
      ...lines,
      '',
      `Total: ${formatPrice(total)}`,
    ].join('\n')
    return encodeURIComponent(message)
  }

  async function handleCheckout() {
    const ok = await validateStock()
    if (!ok) {
      // El carrito cambió (algo se ajustó o se quitó) — dejamos que la
      // persona revise antes de mandar el pedido, no abrimos WhatsApp todavía.
      return
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`
    window.open(url, '_blank')
  }

  return (
    <Sheet
      onOpenChange={(isOpen) => {
        if (isOpen) validateStock()
      }}
    >
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Abrir carrito"
            className="relative hover:text-accent"
          />
        }
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-accent-foreground">
            {itemCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Tu carrito
            {checking && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
            <ShoppingBag className="size-10 opacity-40" />
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => {
                  const atMaxStock =
                    typeof item.stock === 'number' && item.quantity >= item.stock

                  return (
                    <li key={item.id} className="flex gap-3">
                      <Link
                        href={`/producto/${item.slug}`}
                        className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
                      >
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/producto/${item.slug}`}
                            className="text-sm font-medium text-foreground hover:text-accent"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label="Eliminar"
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Restar"
                              className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="min-w-4 text-center text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={atMaxStock}
                              aria-label="Sumar"
                              title={atMaxStock ? 'No hay más stock disponible' : undefined}
                              className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted-foreground"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                        {atMaxStock && (
                          <span className="text-[11px] text-muted-foreground">
                            Máximo stock disponible
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="border-t border-border px-4 pb-4 pt-4">
              <div className="flex items-center justify-between text-base font-medium text-foreground">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={checking}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checking ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Verificando stock...
                  </>
                ) : (
                  'Finalizar pedido por WhatsApp'
                )}
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-full text-center text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
