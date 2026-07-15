import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/notifications — get current user's notifications
export async function GET() {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const notifications = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('GET /api/notifications error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// PATCH /api/notifications — mark as read
export async function PATCH(req: Request) {
  try {
    const { requireAuth } = await import('@/lib/auth')
    const user = await requireAuth()

    const body = await req.json()
    const { notificationId, markAllRead } = body

    if (markAllRead) {
      await db.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
      })
      return NextResponse.json({ success: true, action: 'all_marked_read' })
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    const updated = await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /api/notifications error:', error)
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
  }
}
