# EthiopianMart

EthiopianMart is a full-stack marketplace for Ethiopian products, local sellers, and everyday shopping. It includes a live catalog, credential authentication, cart and checkout flows, orders, reviews, wishlists, seller tools, and an admin workspace.

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- Prisma with SQLite
- NextAuth credential sessions
- TanStack Query for the live storefront catalog
- Zustand for lightweight client UI and cart state

## Run locally

1. Copy `.env.example` to `.env` and replace the secrets.
2. Install dependencies with `npm install`.
3. Run `npm run db:generate` and `npm run db:push`.
4. Optionally set the seed account variables, then run `npm run db:seed`.
5. Start with `npm run dev`.

## Production notes

- Set a strong `NEXTAUTH_SECRET` and keep every `.env` value outside Git.
- Put the SQLite database on a persistent volume, or migrate the Prisma datasource for a managed production database before horizontal scaling.
- Seed passwords are read from environment variables; the UI does not expose demo accounts.
- Validate releases with `npm run lint`, `npm run typecheck`, and `npm run build`.

## Core routes

The customer application lives at `/`. Marketplace APIs are under `/api/products`, `/api/categories`, `/api/cart`, `/api/orders`, `/api/reviews`, `/api/wishlist`, and `/api/addresses`. Admin APIs require the `ADMIN` role.
