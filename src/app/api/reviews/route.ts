import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/reviews?productId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
    }

    const reviews = await db.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('GET /api/reviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST /api/reviews — create a review (must be signed in)
export async function POST(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const body = await req.json()
    const { productId, rating, comment, title } = body

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Product ID, rating, and comment are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    // Check if user already reviewed this product
    const existing = await db.review.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      )
    }

    // Create review
    const review = await db.review.create({
      data: {
        userId: user.id,
        productId,
        rating: parseInt(rating),
        comment,
        title: title || null,
        verified: true, // In production, check if user purchased the product
      },
    })

    // Update product rating
    const reviews = await db.review.findMany({ where: { productId } })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await db.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('POST /api/reviews error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Please sign in to leave a review' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
