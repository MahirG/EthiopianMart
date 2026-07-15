import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/products/[id] — get single product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true, slug: true } },
        vendor: { select: { name: true } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Track product view (lightweight analytics)
    await db.productView.create({
      data: {
        productId: product.id,
        sessionId: req.headers.get('x-session-id') || null,
      },
    }).catch(() => {}) // ignore analytics errors

    // Get related products
    const related = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
    })

    return NextResponse.json({ ...product, related })
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT /api/products/[id] — update product (vendor/admin)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const { id } = await params
    const product = await db.product.findUnique({ where: { id } })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Only the vendor who owns it or admin can update
    if (product.vendorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    // Build update data — only include fields that are provided
    const updateData: Record<string, unknown> = {}
    const fields = [
      'name', 'description', 'shortDescription', 'barcode', 'brand',
      'manufacturer', 'countryOfOrigin', 'warehouseLocation', 'weight',
      'dimensions', 'warranty', 'seoTitle', 'seoDescription', 'categoryIcon',
    ]
    fields.forEach((f) => {
      if (body[f] !== undefined) updateData[f] = body[f]
    })

    // Numeric fields
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice ? parseFloat(body.originalPrice) : null
    if (body.costPrice !== undefined) updateData.costPrice = body.costPrice ? parseFloat(body.costPrice) : null
    if (body.wholesalePrice !== undefined) updateData.wholesalePrice = body.wholesalePrice ? parseFloat(body.wholesalePrice) : null
    if (body.salePrice !== undefined) updateData.salePrice = body.salePrice ? parseFloat(body.salePrice) : null
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock)
    if (body.lowStockThreshold !== undefined) updateData.lowStockThreshold = parseInt(body.lowStockThreshold)
    if (body.deliveryDays !== undefined) updateData.deliveryDays = parseInt(body.deliveryDays)

    // Boolean fields
    ;['unlimitedStock', 'isLocal', 'isOrganic', 'isHandmade', 'isFeatured',
      'isBestseller', 'isPublished', 'isArchived', 'isActive'].forEach((f) => {
      if (body[f] !== undefined) updateData[f] = body[f]
    })

    // JSON fields
    if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags)
    if (body.images !== undefined) updateData.images = JSON.stringify(body.images)
    if (body.videos !== undefined) updateData.videos = JSON.stringify(body.videos)
    if (body.specs !== undefined) updateData.specs = JSON.stringify(body.specs)

    // Category
    if (body.categoryId) updateData.categoryId = body.categoryId
    if (body.subcategoryId !== undefined) updateData.subcategoryId = body.subcategoryId || null

    const updated = await db.product.update({
      where: { id },
      data: updateData,
      include: { variants: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// PATCH /api/products/[id] — quick actions (archive, publish, duplicate)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const { id } = await params
    const body = await req.json()
    const { action } = body

    const product = await db.product.findUnique({
      where: { id },
      include: { variants: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (action === 'duplicate') {
      // Only admin or vendor owner can duplicate
      if (product.vendorId !== user.id && user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-copy-' + Date.now().toString(36)
      const newSku = `${product.sku}-COPY-${Date.now().toString(36).toUpperCase()}`

      const duplicated = await db.product.create({
        data: {
          name: `${product.name} (Copy)`,
          slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          originalPrice: product.originalPrice,
          costPrice: product.costPrice,
          wholesalePrice: product.wholesalePrice,
          salePrice: product.salePrice,
          sku: newSku,
          barcode: product.barcode,
          brand: product.brand,
          manufacturer: product.manufacturer,
          countryOfOrigin: product.countryOfOrigin,
          stock: product.stock,
          unlimitedStock: product.unlimitedStock,
          lowStockThreshold: product.lowStockThreshold,
          warehouseLocation: product.warehouseLocation,
          images: product.images,
          videos: product.videos,
          categoryIcon: product.categoryIcon,
          tags: product.tags,
          weight: product.weight,
          dimensions: product.dimensions,
          warranty: product.warranty,
          specs: product.specs,
          isLocal: product.isLocal,
          isOrganic: product.isOrganic,
          isHandmade: product.isHandmade,
          isPublished: false, // new copies start unpublished
          isFeatured: product.isFeatured,
          isBestseller: false,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          vendorId: user.id,
          deliveryDays: product.deliveryDays,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          variants: product.variants.length > 0 ? {
            create: product.variants.map((v) => ({
              name: v.name,
              value: v.value,
              sku: v.sku,
              price: v.price,
              stock: v.stock,
              image: v.image,
            }))
          } : undefined,
        },
        include: { variants: true },
      })

      return NextResponse.json(duplicated, { status: 201 })
    }

    // Other quick actions: archive, publish, unpublish
    if (product.vendorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updates: Record<string, boolean> = {}
    if (action === 'archive') { updates.isArchived = true; updates.isPublished = false }
    if (action === 'unarchive') { updates.isArchived = false }
    if (action === 'publish') { updates.isPublished = true; updates.isArchived = false }
    if (action === 'unpublish') { updates.isPublished = false }

    const updated = await db.product.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/products/[id] error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/products/[id] — delete product (admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireAdmin } = await import('@/lib/auth')
    await requireAdmin()

    const { id } = await params
    await db.product.delete({ where: { id } })

    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
