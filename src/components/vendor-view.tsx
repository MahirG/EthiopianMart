'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { BarChart3, Boxes, CircleAlert, PackageCheck, Plus, ShoppingBag, Store, WalletCards } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { ProductFormModal } from './admin-product-form'

type Dashboard = {
  seller: { name: string; email: string }
  metrics: { products: number; activeOrders: number; completedRevenue: number; storeVisits: number; lowStock: number }
  products: Array<{ id: string; name: string; sku: string; price: number; stock: number; isPublished: boolean; categoryIcon: string; category: { name: string } }>
  orders: Array<{ id: string; orderNumber: string; status: string; paymentStatus: string; createdAt: string; customer: string; total: number; itemCount: number }>
}

async function fetchDashboard(): Promise<Dashboard> {
  const response = await fetch('/api/vendor/dashboard')
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Unable to load seller dashboard')
  return data
}

export function VendorView() {
  const { openAuth } = useAppStore()
  const { status } = useSession()
  const [tab, setTab] = useState<'overview' | 'products' | 'orders'>('overview')
  const [formOpen, setFormOpen] = useState(false)
  const dashboard = useQuery({ queryKey: ['vendor-dashboard'], queryFn: fetchDashboard, enabled: status === 'authenticated' })

  if (status === 'unauthenticated') {
    return <PortalMessage title="Seller sign in" body="Sign in with an approved seller account to manage your catalog and orders." action="Sign in" onAction={() => openAuth('login')} />
  }
  if (dashboard.isError) {
    return <PortalMessage title="Seller access required" body={dashboard.error instanceof Error ? dashboard.error.message : 'This account does not have seller access.'} action="Try again" onAction={() => dashboard.refetch()} />
  }
  if (status === 'loading' || dashboard.isLoading || !dashboard.data) {
    return <div className="grid min-h-[420px] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
  }

  const data = dashboard.data
  const metrics = [
    [WalletCards, 'Revenue', `${data.metrics.completedRevenue.toLocaleString()} ETB`],
    [PackageCheck, 'Active orders', data.metrics.activeOrders.toLocaleString()],
    [Boxes, 'Products', data.metrics.products.toLocaleString()],
    [BarChart3, 'Product views', data.metrics.storeVisits.toLocaleString()],
  ] as const

  return (
    <div className="space-y-6 pb-8">
      <section className="flex flex-col justify-between gap-5 rounded-[28px] bg-[#0f5132] p-7 text-white sm:flex-row sm:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f3c64d]">Seller portal</p><h1 className="mt-2 text-3xl font-black">{data.seller.name}</h1><p className="mt-2 text-sm text-white/65">Live inventory, customer orders, and store performance.</p></div>
        <button onClick={() => setFormOpen(true)} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f3c64d] px-5 py-3 text-sm font-extrabold text-[#173326]"><Plus className="h-4 w-4" /> Add product</button>
      </section>

      <div className="flex gap-2 overflow-x-auto">
        {([['overview', 'Overview'], ['products', 'Products'], ['orders', 'Orders']] as const).map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`rounded-full px-4 py-2 text-xs font-bold ${tab === id ? 'bg-primary text-primary-foreground' : 'border border-border bg-card'}`}>{label}</button>)}
      </div>

      {tab === 'overview' && <>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(([Icon, label, value]) => <div key={label} className="rounded-2xl border border-border bg-card p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-5 text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-1 text-xl font-black">{value}</p></div>)}</div>
        {data.metrics.lowStock > 0 && <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4"><CircleAlert className="h-5 w-5 text-amber-700" /><p className="text-sm"><strong>{data.metrics.lowStock} products need attention.</strong> Their stock is at or below the configured threshold.</p></div>}
        <DataTable title="Recent orders"><OrderRows orders={data.orders.slice(0, 6)} /></DataTable>
      </>}

      {tab === 'products' && <DataTable title={`${data.products.length} products`}><div className="divide-y divide-border">{data.products.map((product) => <div key={product.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3"><span className="text-2xl">{product.categoryIcon}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{product.name}</p><p className="text-[10px] text-muted-foreground">{product.sku} · {product.category.name} · Stock {product.stock}</p></div><p className="text-sm font-black">{product.price.toLocaleString()} ETB</p></div>)}</div></DataTable>}
      {tab === 'orders' && <DataTable title={`${data.orders.length} seller orders`}><OrderRows orders={data.orders} /></DataTable>}

      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={() => dashboard.refetch()} />
    </div>
  )
}

function OrderRows({ orders }: { orders: Dashboard['orders'] }) {
  if (!orders.length) return <div className="p-10 text-center text-sm text-muted-foreground">No seller orders yet.</div>
  return <div className="divide-y divide-border">{orders.map((order) => <div key={order.id} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 sm:grid-cols-[1fr_1fr_auto]"><div><p className="text-sm font-bold">{order.orderNumber}</p><p className="text-[10px] text-muted-foreground">{order.itemCount} items · {new Date(order.createdAt).toLocaleDateString()}</p></div><p className="hidden text-xs text-muted-foreground sm:block">{order.customer} · {order.status.replaceAll('_', ' ')}</p><p className="text-sm font-black">{order.total.toLocaleString()} ETB</p></div>)}</div>
}

function DataTable({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="overflow-hidden rounded-2xl border border-border bg-card"><div className="flex items-center gap-2 border-b border-border px-4 py-3"><ShoppingBag className="h-4 w-4 text-primary" /><h2 className="text-sm font-extrabold">{title}</h2></div>{children}</section>
}

function PortalMessage({ title, body, action, onAction }: { title: string; body: string; action: string; onAction: () => void }) {
  return <div className="mx-auto flex min-h-[440px] max-w-lg flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10"><Store className="h-7 w-7 text-primary" /></span><h1 className="mt-6 text-2xl font-black">{title}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p><button onClick={onAction} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">{action}</button></div>
}
