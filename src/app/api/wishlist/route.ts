import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/wishlist — get current user's wishlist
export async function GET() {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const items = await db.wishlistItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: { select: { name: true } } }
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('GET /api/wishlist error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

// POST /api/wishlist — toggle wishlist item
export async function POST(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const body = await req.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const existing = await db.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })

    if (existing) {
      await db.wishlistItem.delete({ where: { id: existing.id } })
      return NextResponse.json({ action: 'removed' })
    }

    const item = await db.wishlistItem.create({
      data: { userId: user.id, productId },
    })

    return NextResponse.json({ action: 'added', item }, { status: 201 })
  } catch (error) {
    console.error('POST /api/wishlist error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to use wishlist' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to toggle wishlist' }, { status: 500 })
  }
}
