import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/orders — get current user's orders
export async function GET() {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const orders = await db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        address: true,
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST /api/orders — create a new order
export async function POST(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const body = await req.json()
    const { addressId, paymentMethod, couponCode, deliveryFee = 0 } = body

    // Get user's cart
    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: { include: { product: true } },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 })
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.name}` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    let discount = 0
    if (couponCode) {
      // Simple coupon logic — in production, validate against a coupons table
      const coupons: Record<string, { discount: number; type: 'percent' | 'fixed' }> = {
        WELCOME10: { discount: 10, type: 'percent' },
        COFFEE23: { discount: 23, type: 'percent' },
        FRIDAY18: { discount: 18, type: 'percent' },
        GULIT500: { discount: 500, type: 'fixed' },
      }
      const coupon = coupons[couponCode.toUpperCase()]
      if (coupon) {
        discount = coupon.type === 'percent'
          ? Math.round(subtotal * coupon.discount / 100)
          : coupon.discount
      }
    }

    const total = subtotal + deliveryFee - discount

    // Generate order number
    const orderNumber = `GUL-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        userId: user.id,
        addressId: addressId || null,
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod: paymentMethod || 'TELEBIRR',
        paymentStatus: 'PENDING',
        status: 'PLACED',
        couponCode: couponCode || null,
        progress: 10,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.categoryIcon,
          })),
        },
      },
      include: { items: true },
    })

    // Decrement stock
    for (const item of cart.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    // Clear cart
    await db.cartItem.deleteMany({ where: { cartId: cart.id } })

    // Create order confirmation notification
    await db.notification.create({
      data: {
        userId: user.id,
        type: 'order',
        title: 'Order Placed Successfully! 🎉',
        message: `Your order ${orderNumber} has been placed. Total: ${total.toLocaleString()} ETB.`,
        icon: '📦',
        read: false,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to place an order' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
