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
    const updated = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price ? parseFloat(body.price) : undefined,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        categoryIcon: body.categoryIcon,
        deliveryDays: body.deliveryDays ? parseInt(body.deliveryDays) : undefined,
        isLocal: body.isLocal,
        isOrganic: body.isOrganic,
        isHandmade: body.isHandmade,
        isFeatured: body.isFeatured,
        isBestseller: body.isBestseller,
        isActive: body.isActive,
      },
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
