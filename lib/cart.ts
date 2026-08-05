import type { Product, Combo, CartItem } from '@/types'

export function productToCartItem(product: Product): Omit<CartItem, 'quantity'> {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0] ?? '',
    type: 'product',
    stock: product.stock,
  }
}

export function comboToCartItem(combo: Combo): Omit<CartItem, 'quantity'> {
  return {
    id: combo.id,
    slug: combo.slug,
    name: combo.name,
    price: combo.price,
    image: combo.images[0] ?? '',
    type: 'combo',
    // Combo no tiene campo stock propio en tu modelo actual, así que queda sin límite.
    // Si más adelante querés limitarlo, se podría calcular como el mínimo stock
    // entre los productos que lo componen.
  }
}
