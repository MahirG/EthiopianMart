import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()
    const orders = await db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true, address: true },
    })
    return NextResponse.json(orders)
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()
    const body = await req.json()
    const requestedItems = Array.isArray(body.items) ? body.items : []

    if (!requestedItems.length || requestedItems.length > 100) {
      return NextResponse.json({ error: 'Your cart is empty or too large' }, { status: 400 })
    }

    const quantities = new Map<string, number>()
    for (const item of requestedItems) {
      const productId = typeof item.productId === 'string' ? item.productId : ''
      const quantity = Number(item.quantity)
      if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json({ error: 'Invalid cart item' }, { status: 400 })
      }
      quantities.set(productId, (quantities.get(productId) || 0) + quantity)
    }

    const products = await db.product.findMany({
      where: { id: { in: [...quantities.keys()] }, isActive: true, isPublished: true, isArchived: false },
    })
    if (products.length !== quantities.size) return NextResponse.json({ error: 'One or more products are unavailable' }, { status: 400 })

    for (const product of products) {
      const quantity = quantities.get(product.id)!
      if (!product.unlimitedStock && product.stock < quantity) {
        return NextResponse.json({ error: `Only ${product.stock} left for ${product.name}` }, { status: 409 })
      }
    }

    const address = body.addressId ? await db.address.findFirst({ where: { id: body.addressId, userId: user.id } }) : null
    if (!address) return NextResponse.json({ error: 'Choose a valid delivery address' }, { status: 400 })

    const allowedPayments = new Set(['telebirr', 'cbe', 'chapa', 'santim', 'cod'])
    const paymentMethod = allowedPayments.has(body.paymentMethod) ? body.paymentMethod.toUpperCase() : 'COD'
    const subtotal = products.reduce((sum, product) => sum + product.price * quantities.get(product.id)!, 0)
    const deliveryFee = subtotal >= 500 ? 0 : 50
    const couponCode = typeof body.couponCode === 'string' ? body.couponCode.toUpperCase() : ''
    const coupons: Record<string, { amount: number; type: 'percent' | 'fixed'; minimum: number }> = {
      WELCOME10: { amount: 10, type: 'percent', minimum: 500 },
      COFFEE23: { amount: 23, type: 'percent', minimum: 1000 },
      FRIDAY18: { amount: 18, type: 'percent', minimum: 1500 },
      ETHIOMART500: { amount: 500, type: 'fixed', minimum: 5000 },
    }
    const coupon = coupons[couponCode]
    const discount = coupon && subtotal >= coupon.minimum
      ? Math.min(subtotal, coupon.type === 'percent' ? Math.round(subtotal * coupon.amount / 100) : coupon.amount)
      : 0
    const total = Math.max(0, subtotal + deliveryFee - discount)
    const orderNumber = `ETM-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`

    const order = await db.$transaction(async (tx) => {
      for (const product of products) {
        if (product.unlimitedStock) continue
        const quantity = quantities.get(product.id)!
        const result = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        })
        if (result.count !== 1) throw new Error(`STOCK:${product.name}`)
      }

      const created = await tx.order.create({
        data: {
          orderNumber, userId: user.id, addressId: address.id, subtotal, deliveryFee, discount, total,
          paymentMethod, paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING', status: 'PLACED',
          couponCode: discount > 0 ? couponCode : null, progress: 10,
          items: { create: products.map((product) => ({
            productId: product.id, name: product.name, price: product.price,
            quantity: quantities.get(product.id)!, image: product.categoryIcon,
          })) },
        },
        include: { items: true, address: true },
      })
      const serverCart = await tx.cart.findUnique({ where: { userId: user.id } })
      if (serverCart) await tx.cartItem.deleteMany({ where: { cartId: serverCart.id } })
      await tx.notification.create({ data: { userId: user.id, type: 'order', title: 'Order placed', message: `Order ${orderNumber} is confirmed for ${total.toLocaleString()} ETB.`, icon: '📦' } })
      return created
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Please sign in to place an order' }, { status: 401 })
    if (error instanceof Error && error.message.startsWith('STOCK:')) return NextResponse.json({ error: `Stock changed for ${error.message.slice(6)}. Review your cart.` }, { status: 409 })
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
