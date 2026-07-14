import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/cart — get current user's cart
export async function GET() {
  try {
    const { getCurrentUser } = await import('@/lib/auth')
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ items: [] })
    }

    let cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: { category: { select: { name: true } } }
            },
          },
        },
      },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: user.id },
        include: {
          items: {
            include: {
              product: {
                include: { category: { select: { name: true } } }
              },
            },
          },
        },
      })
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('GET /api/cart error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

// POST /api/cart — add item to cart
export async function POST(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const body = await req.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Get or create cart
    let cart = await db.cart.findUnique({ where: { userId: user.id } })
    if (!cart) {
      cart = await db.cart.create({ data: { userId: user.id } })
    }

    // Check if item exists in cart
    const existing = await db.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId },
      },
    })

    if (existing) {
      // Update quantity
      const updated = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      })
      return NextResponse.json(updated)
    }

    // Create new cart item
    const cartItem = await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    })

    return NextResponse.json(cartItem, { status: 201 })
  } catch (error) {
    console.error('POST /api/cart error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to add items to cart' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

// PATCH /api/cart — update item quantity
export async function PATCH(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const body = await req.json()
    const { cartItemId, quantity } = body

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: 'Cart item ID and quantity required' }, { status: 400 })
    }

    const cart = await db.cart.findUnique({ where: { userId: user.id } })
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const item = await db.cartItem.findUnique({ where: { id: cartItemId } })
    if (!item || item.cartId !== cart.id) {
      return NextResponse.json({ error: 'Item not in your cart' }, { status: 403 })
    }

    if (quantity <= 0) {
      await db.cartItem.delete({ where: { id: cartItemId } })
      return NextResponse.json({ deleted: true })
    }

    const updated = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/cart error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

// DELETE /api/cart — remove item from cart
export async function DELETE(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const { searchParams } = new URL(req.url)
    const cartItemId = searchParams.get('cartItemId')

    if (!cartItemId) {
      return NextResponse.json({ error: 'Cart item ID required' }, { status: 400 })
    }

    const cart = await db.cart.findUnique({ where: { userId: user.id } })
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    const item = await db.cartItem.findUnique({ where: { id: cartItemId } })
    if (!item || item.cartId !== cart.id) {
      return NextResponse.json({ error: 'Item not in your cart' }, { status: 403 })
    }

    await db.cartItem.delete({ where: { id: cartItemId } })

    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error('DELETE /api/cart error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}
