'use client'

import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Check, MapPin, PackageCheck, ReceiptText, Truck } from 'lucide-react'
import { useAppStore } from '@/lib/store'

type Order = {
  id: string; orderNumber: string; subtotal: number; deliveryFee: number; discount: number; total: number;
  status: string; paymentMethod: string; paymentStatus: string; progress: number; createdAt: string;
  address: { fullName: string; phone: string; city: string; area: string; details: string } | null;
  items: Array<{ id: string; name: string; price: number; quantity: number; image: string }>;
}

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch('/api/orders')
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Unable to load orders')
  return data
}

const stages = ['PLACED', 'CONFIRMED', 'PACKING', 'ON_THE_WAY', 'DELIVERED']

export function OrdersView() {
  const { status } = useSession()
  const { openAuth, setView } = useAppStore()
  const orders = useQuery({ queryKey: ['orders'], queryFn: fetchOrders, enabled: status === 'authenticated' })

  if (status === 'unauthenticated') return <OrdersMessage title="Sign in to see your orders" body="Order history and delivery progress are private to your account." action="Sign in" onAction={() => openAuth('login')} />
  if (status === 'loading' || orders.isLoading) return <div className="grid min-h-[440px] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
  if (orders.isError) return <OrdersMessage title="Orders could not be loaded" body={orders.error instanceof Error ? orders.error.message : 'Try again shortly.'} action="Try again" onAction={() => orders.refetch()} />
  if (!orders.data?.length) return <OrdersMessage title="No orders yet" body="When you complete checkout, the real order and delivery status will appear here." action="Start shopping" onAction={() => setView('search')} />

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      <div className="border-b border-border pb-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Your account</p><h1 className="mt-2 text-3xl font-black">Orders</h1><p className="mt-2 text-sm text-muted-foreground">Live status for every EthiopianMart purchase.</p></div>
      <div className="grid gap-5">
        {orders.data.map((order) => {
          const stageIndex = stages.indexOf(order.status)
          const cancelled = order.status === 'CANCELLED'
          return (
            <article key={order.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5"><div><p className="text-sm font-extrabold">{order.orderNumber}</p><p className="mt-1 text-[10px] font-semibold text-muted-foreground">Placed {new Date(order.createdAt).toLocaleString()}</p></div><span className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${cancelled ? 'bg-destructive/10 text-destructive' : order.status === 'DELIVERED' ? 'bg-primary/10 text-primary' : 'bg-[#f3c64d]/25 text-[#7a5b00]'}`}>{order.status.replaceAll('_', ' ')}</span></header>
              <div className="grid gap-6 p-5 lg:grid-cols-[1fr_260px]">
                <div>
                  <div className="grid gap-3">{order.items.map((item) => <div key={item.id} className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">{item.image}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{item.name}</p><p className="text-xs text-muted-foreground">{item.quantity} × {item.price.toLocaleString()} ETB</p></div><strong className="text-sm">{(item.quantity * item.price).toLocaleString()} ETB</strong></div>)}</div>
                  {!cancelled && <div className="mt-7"><div className="flex justify-between">{stages.map((stage, index) => <div key={stage} className="flex flex-1 flex-col items-center"><span className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] font-bold ${index <= stageIndex ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}`}>{index < stageIndex ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className="mt-2 hidden text-[8px] font-bold text-muted-foreground sm:block">{stage.replaceAll('_', ' ')}</span></div>)}</div><div className="mx-[10%] -mt-[22px] h-0.5 bg-border"><div className="h-full bg-primary transition-all" style={{ width: `${Math.max(0, Math.min(100, order.progress))}%` }} /></div></div>}
                </div>
                <aside className="rounded-xl bg-muted/60 p-4 text-xs"><div className="flex items-center gap-2 font-extrabold"><ReceiptText className="h-4 w-4 text-primary" /> Order total</div><p className="mt-3 text-xl font-black">{order.total.toLocaleString()} ETB</p><p className="mt-1 text-muted-foreground">{order.paymentMethod} · {order.paymentStatus}</p>{order.address && <div className="mt-5 border-t border-border pt-4"><p className="flex items-center gap-2 font-extrabold"><MapPin className="h-4 w-4 text-primary" /> Delivery</p><p className="mt-2 leading-5 text-muted-foreground">{order.address.details}, {order.address.area ? `${order.address.area}, ` : ''}{order.address.city}</p><p className="mt-1 text-muted-foreground">{order.address.phone}</p></div>}</aside>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function OrdersMessage({ title, body, action, onAction }: { title: string; body: string; action: string; onAction: () => void }) {
  return <div className="mx-auto flex min-h-[460px] max-w-lg flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10"><PackageCheck className="h-7 w-7 text-primary" /></span><h1 className="mt-6 text-2xl font-black">{title}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p><button onClick={onAction} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">{action}</button></div>
}
