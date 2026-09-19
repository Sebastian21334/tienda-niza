export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: string
  order: number
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  /** Precio anterior (para mostrar descuento). Opcional. */
  compareAtPrice?: number
  stock: number
  material: string
  categoryId: string
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
  available: boolean
  images: string[]
  rating: number
  reviews: number
  createdAt: string
}

export interface Combo {
  id: string
  slug: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  productIds: string[]
  images: string[]
  available: boolean
  createdAt: string
}

export interface StoreConfig {
  name: string
  logo: string
  heroImage?: string | null
  aboutImage?: string | null
  slogan: string
  description: string
  whatsapp: string
  instagram: string
  facebook: string
  address: string
  hours: string
  footerInfo: string
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'best-selling'

export interface ProductQuery {
  search?: string
  category?: string
  sort?: SortOption
  page?: number
  perPage?: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}


export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: 'product' | 'combo';
  /** Stock disponible al momento de agregarlo. undefined = sin límite (ej. combos) */
  stock?: number;
};
