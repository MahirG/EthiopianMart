import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/addresses — get current user's addresses
export async function GET() {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const addresses = await db.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('GET /api/addresses error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

// POST /api/addresses — create a new address
export async function POST(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const body = await req.json()
    const { fullName, phone, city, area, details, isDefault } = body

    if (!fullName || !phone || !city || !details) {
      return NextResponse.json(
        { error: 'Full name, phone, city, and details are required' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await db.address.create({
      data: {
        userId: user.id,
        fullName,
        phone,
        city,
        area: area || '',
        details,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error('POST /api/addresses error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to add address' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}
