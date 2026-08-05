"use client"

import { createContext, useContext, useEffect, useReducer, ReactNode } from "react"
import { toast } from "sonner"
import type { CartItem } from "@/types"

type CartState = { items: CartItem[] }

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_STOCK"; payload: { id: string; stock: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const STORAGE_KEY = "cart"

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART":
      return { items: action.payload }

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        }
      }
      return { items: [...state.items, action.payload] }
    }

    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload.id) }

    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== action.payload.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }

    case "UPDATE_STOCK":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, stock: action.payload.stock } : i
        ),
      }

    case "CLEAR_CART":
      return { items: [] }

    default:
      return state
  }
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  syncStock: (id: string, stock: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Cargar carrito guardado al montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(saved) })
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Guardar cada vez que cambia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  /**
   * Agrega un ítem al carrito, respetando el stock disponible.
   * - Si el ítem no tiene `stock` definido (ej. combos), no hay límite.
   * - Si ya hay unidades en el carrito, suma sobre lo existente sin pasar el stock.
   * - Si no hay lugar para ninguna unidad más, avisa y no agrega nada.
   * - Si hay lugar para menos de lo pedido, agrega lo que se puede y avisa.
   */
  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const existing = state.items.find((i) => i.id === item.id)
    const currentQty = existing?.quantity ?? 0
    const maxStock = item.stock

    if (typeof maxStock === "number") {
      const available = maxStock - currentQty

      if (available <= 0) {
        toast.error(`No hay más stock disponible de "${item.name}"`)
        return
      }

      if (quantity > available) {
        dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: available } })
        toast.warning(
          `Solo quedan ${available} unidad${available === 1 ? "" : "es"} de "${item.name}"`
        )
        return
      }
    }

    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity } })
  }

  /**
   * Actualiza la cantidad de un ítem (usado por los botones +/- del carrito),
   * respetando el mismo tope de stock cacheado en el propio ítem.
   */
  const updateQuantity = (id: string, quantity: number) => {
    const item = state.items.find((i) => i.id === id)

    if (item && typeof item.stock === "number" && quantity > item.stock) {
      toast.error(
        `Solo hay ${item.stock} unidad${item.stock === 1 ? "" : "es"} disponible${item.stock === 1 ? "" : "s"} de "${item.name}"`
      )
      quantity = item.stock
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  /**
   * Actualiza solo el stock cacheado de un ítem (no la cantidad).
   * Se usa cuando revalidamos contra la base de datos, para que los
   * botones +/- del carrito usen siempre el límite real y actualizado.
   */
  const syncStock = (id: string, stock: number) => {
    dispatch({ type: "UPDATE_STOCK", payload: { id, stock } })
  }

  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: { id } })

  const clearCart = () => dispatch({ type: "CLEAR_CART" })

  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        syncStock,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider")
  return context
}
