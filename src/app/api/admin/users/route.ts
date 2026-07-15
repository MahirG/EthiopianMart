import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/users — all users for admin
export async function GET() {
  try {
    const { requireAdmin } = await import('@/lib/auth')
    await requireAdmin()

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            products: true,
          },
        },
      },
      take: 100,
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('GET /api/admin/users error:', error)
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
