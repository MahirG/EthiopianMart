import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/products — list products with filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'relevance'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const isLocal = searchParams.get('isLocal')
    const brand = searchParams.get('brand')
    const minRating = searchParams.get('minRating')
    const inStock = searchParams.get('inStock')
    const isFeatured = searchParams.get('isFeatured')
    const isBestseller = searchParams.get('isBestseller')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
      isArchived: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
        { sku: { contains: search } },
        { brand: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (brand) {
      where.brand = { contains: brand }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as { gte?: number }).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as { lte?: number }).lte = parseFloat(maxPrice)
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) }
    }

    if (inStock === 'true') {
      where.OR = [
        { unlimitedStock: true },
        { stock: { gt: 0 } },
      ]
    }

    if (isLocal === 'true') {
      where.isLocal = true
    }
    if (isFeatured === 'true') {
      where.isFeatured = true
    }
    if (isBestseller === 'true') {
      where.isBestseller = true
    }

    // Build order by
    let orderBy: Record<string, string> = { createdAt: 'desc' }
    switch (sort) {
      case 'price_low': orderBy = { price: 'asc' }; break
      case 'price_high': orderBy = { price: 'desc' }; break
      case 'rating': orderBy = { rating: 'desc' }; break
      case 'newest': orderBy = { createdAt: 'desc' }; break
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          category: { select: { name: true, slug: true } },
          vendor: { select: { name: true } },
        },
      }),
      db.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products — create product (vendor/admin only)
export async function POST(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    if (user.role !== 'VENDOR' && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only vendors and admins can create products' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      name, description, shortDescription, price, originalPrice, costPrice,
      wholesalePrice, salePrice, stock, unlimitedStock, lowStockThreshold,
      warehouseLocation, sku, barcode, brand, manufacturer, countryOfOrigin,
      categoryIcon, categoryId, subcategoryId, deliveryDays, isLocal, isOrganic,
      isHandmade, isFeatured, isBestseller, isPublished, tags, images, videos,
      weight, dimensions, warranty, specs, variants, seoTitle, seoDescription,
    } = body

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36)

    // Generate unique SKU if not provided
    const finalSku = sku || `SKU-${Date.now().toString(36).toUpperCase()}`

    const product = await db.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : null,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: finalSku,
        barcode: barcode || null,
        brand: brand || null,
        manufacturer: manufacturer || null,
        countryOfOrigin: countryOfOrigin || null,
        stock: parseInt(stock || '0'),
        unlimitedStock: unlimitedStock || false,
        lowStockThreshold: parseInt(lowStockThreshold || '5'),
        warehouseLocation: warehouseLocation || null,
        images: images ? JSON.stringify(images) : '[]',
        videos: videos ? JSON.stringify(videos) : '[]',
        categoryIcon: categoryIcon || '📦',
        categoryId,
        subcategoryId: subcategoryId || null,
        vendorId: user.id,
        deliveryDays: parseInt(deliveryDays || '3'),
        isLocal: isLocal || false,
        isOrganic: isOrganic || false,
        isHandmade: isHandmade || false,
        isFeatured: isFeatured || false,
        isBestseller: isBestseller || false,
        isPublished: isPublished !== false,
        tags: tags ? JSON.stringify(tags) : '[]',
        weight: weight || null,
        dimensions: dimensions || null,
        warranty: warranty || null,
        specs: specs ? JSON.stringify(specs) : '[]',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        variants: variants && variants.length > 0 ? {
          create: variants.map((v: { name: string; value: string; sku?: string; price?: number; stock?: number; image?: string }) => ({
            name: v.name,
            value: v.value,
            sku: v.sku || null,
            price: v.price ? parseFloat(v.price) : 0,
            stock: v.stock ? parseInt(v.stock) : 0,
            image: v.image || null,
          }))
        } : undefined,
      },
      include: { variants: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
