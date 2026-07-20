import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()
    if (user.role !== 'VENDOR' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seller access required' }, { status: 403 })
    }

    const products = await db.product.findMany({
      where: { vendorId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: { category: { select: { name: true } } },
      take: 100,
    })
    const productIds = products.map((product) => product.id)
    const [orderItems, storeVisits] = productIds.length ? await Promise.all([
      db.orderItem.findMany({
        where: { productId: { in: productIds } },
        include: {
          order: {
            select: {
              id: true, orderNumber: true, status: true, paymentStatus: true,
              createdAt: true, user: { select: { name: true } },
            },
          },
        },
      }),
      db.productView.count({ where: { productId: { in: productIds } } }),
    ]) : [[], 0]

    const orderMap = new Map<string, {
      id: string; orderNumber: string; status: string; paymentStatus: string;
      createdAt: Date; customer: string; total: number; itemCount: number
    }>()
    for (const item of orderItems) {
      const current = orderMap.get(item.order.id)
      const lineTotal = item.price * item.quantity
      if (current) {
        current.total += lineTotal
        current.itemCount += item.quantity
      } else {
        orderMap.set(item.order.id, {
          id: item.order.id,
          orderNumber: item.order.orderNumber,
          status: item.order.status,
          paymentStatus: item.order.paymentStatus,
          createdAt: item.order.createdAt,
          customer: item.order.user.name,
          total: lineTotal,
          itemCount: item.quantity,
        })
      }
    }
    const orders = [...orderMap.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    const completedRevenue = orders
      .filter((order) => order.status !== 'CANCELLED' && order.paymentStatus !== 'REFUNDED')
      .reduce((sum, order) => sum + order.total, 0)

    return NextResponse.json({
      seller: { name: user.name, email: user.email },
      metrics: {
        products: products.length,
        activeOrders: orders.filter((order) => !['DELIVERED', 'CANCELLED'].includes(order.status)).length,
        completedRevenue,
        storeVisits,
        lowStock: products.filter((product) => !product.unlimitedStock && product.stock <= product.lowStockThreshold).length,
      },
      products,
      orders: orders.slice(0, 50),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    }
    console.error('GET /api/vendor/dashboard error:', error)
    return NextResponse.json({ error: 'Failed to load seller dashboard' }, { status: 500 })
  }
}
