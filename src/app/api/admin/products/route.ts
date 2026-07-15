import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/products — all products for admin
export async function GET() {
  try {
    const { requireAdmin } = await import('@/lib/auth')
    await requireAdmin()

    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        vendor: { select: { name: true } },
      },
      take: 100,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('GET /api/admin/products error:', error)
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
