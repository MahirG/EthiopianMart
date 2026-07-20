import type { Category, Product } from './types'

type ApiCategory = {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  productCount: number
}

type ApiProduct = {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number | null
  rating: number
  reviewCount: number
  images: string
  categoryIcon: string
  stock: number
  unlimitedStock: boolean
  deliveryDays: number
  isLocal: boolean
  isOrganic: boolean
  isHandmade: boolean
  tags: string
  category: { name: string; slug: string }
  vendor: { name: string } | null
  vendorId: string | null
  countryOfOrigin: string | null
}

type ProductsResponse = {
  products: ApiProduct[]
  total: number
  hasMore: boolean
}

function parseStringArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function mapApiProduct(product: ApiProduct): Product {
  const images = parseStringArray(product.images)
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined

  return {
    id: product.id,
    name: product.name,
    category: product.category.slug,
    categoryIcon: product.categoryIcon,
    price: product.price,
    originalPrice: product.originalPrice ?? undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    image: images[0] ?? '',
    vendor: product.vendor?.name ?? 'Independent seller',
    vendorId: product.vendorId ?? '',
    location: product.countryOfOrigin ?? 'Ethiopia',
    inStock: product.unlimitedStock || product.stock > 0,
    deliveryDays: product.deliveryDays,
    isLocal: product.isLocal,
    isOrganic: product.isOrganic,
    isHandmade: product.isHandmade,
    tags: parseStringArray(product.tags),
    discount,
    description: product.description,
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || 'Marketplace service is temporarily unavailable')
  }
  return data as T
}

export async function fetchCatalogProducts(params: Record<string, string | number | boolean | undefined> = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== false) search.set(key, String(value))
  })

  const response = await fetch(`/api/products?${search.toString()}`)
  const data = await readJson<ProductsResponse>(response)
  return { ...data, products: data.products.map(mapApiProduct) }
}

export async function fetchCatalogCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories')
  const data = await readJson<ApiCategory[]>(response)
  return data.map((category) => ({
    id: category.slug,
    name: category.name,
    icon: category.icon,
    color: category.color,
    productCount: category.productCount,
  }))
}
