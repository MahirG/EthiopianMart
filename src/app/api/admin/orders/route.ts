import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/orders — all orders for admin
export async function GET() {
  try {
    const { requireAdmin } = await import('@/lib/auth')
    await requireAdmin()

    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
        address: true,
      },
      take: 100,
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/admin/orders error:', error)
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: Request) {
  try {
    const { requireAdmin } = await import('@/lib/auth')
    await requireAdmin()

    const body = await req.json()
    const { orderId, status, driverName, driverPhone, driverVehicle, eta } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const progressMap: Record<string, number> = {
      PLACED: 10,
      CONFIRMED: 25,
      PACKING: 50,
      ON_THE_WAY: 75,
      DELIVERED: 100,
      CANCELLED: 0,
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        status,
        progress: progressMap[status] ?? undefined,
        driverName,
        driverPhone,
        driverVehicle,
        eta,
      },
    })

    // Create notification for user
    await db.notification.create({
      data: {
        userId: updated.userId,
        type: 'delivery',
        title: `Order ${status.toLowerCase().replace('_', ' ')}`,
        message: `Your order ${updated.orderNumber} status: ${status.replace('_', ' ')}.`,
        icon: status === 'DELIVERED' ? '✅' : '🚚',
        read: false,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/admin/orders error:', error)
    if (error instanceof Error && (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
