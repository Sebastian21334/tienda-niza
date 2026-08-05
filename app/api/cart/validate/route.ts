import { NextResponse } from 'next/server'
import { getProductsByIds } from '@/services/product-service'

export async function POST(request: Request) {
  const { ids } = (await request.json()) as { ids?: string[] }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ products: [] })
  }

  const products = await getProductsByIds(ids)

  // getProductsByIds ya filtra los que no existen (por ejemplo, si fueron
  // eliminados). Los ids que no vuelven en esta respuesta se interpretan
  // en el frontend como "ya no existen".
  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      stock: p.stock,
      available: p.available,
      price: p.price,
    })),
  })
}
