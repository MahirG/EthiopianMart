import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export function getDb() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  }
  return globalForPrisma.prisma
}

// Existing route handlers import `db`. The proxy keeps that API while ensuring
// Prisma is not constructed when Next.js evaluates modules during a build.
export const db = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getDb()
    const value = Reflect.get(client, property, client)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
