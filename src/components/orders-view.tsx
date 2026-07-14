'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { orders } from '@/lib/data'
import { motion } from 'framer-motion'
import {
  Package, Truck, MapPin, Phone, MessageCircle, Star, Check,
  Navigation, Clock, ChevronRight, Receipt,
} from 'lucide-react'
import { toast } from 'sonner'

const statusSteps = [
  { id: 'placed', label: 'Order Placed', icon: Package },
  { id: 'confirmed', label: 'Confirmed', icon: Check },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'on_the_way', label: 'On the Way', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Check },
]

export function OrdersView() {
  const { language, setView } = useAppStore()

  const activeOrder = orders.find((o) => o.status === 'on_the_way')
  const pastOrders = orders.filter((o) => o.status === 'delivered')

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-black">{t(language, 'myOrders')}</h1>
        <p className="text-sm text-muted-foreground">Track your deliveries in real-time</p>
      </div>

      {/* Active order with live tracking */}
      {activeOrder && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl glass-strong p-5 shadow-premium"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t(language, 'onTheWay')}
              </span>
              <h2 className="font-black text-lg mt-2">{activeOrder.id}</h2>
              <p className="text-xs text-muted-foreground">From {activeOrder.vendor}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activeOrder.eta}</div>
              <div className="text-xs text-muted-foreground">ETA</div>
            </div>
          </div>

          {/* Live map placeholder */}
          <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-emerald-950/40 dark:to-teal-900/40 mb-4">
            {/* Map grid */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />

            {/* Route path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 192" preserveAspectRatio="none">
              <motion.path
                d="M 60 150 Q 150 50 200 100 T 340 60"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="6 6"
                fill="none"
                className="text-emerald-600 dark:text-emerald-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </svg>

            {/* Store marker */}
            <div className="absolute left-[15%] bottom-[25%] flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white text-xs font-bold shadow-lg">
                🏪
              </div>
              <span className="text-[9px] font-bold bg-white/90 dark:bg-black/70 px-1 rounded mt-0.5">Store</span>
            </div>

            {/* Driver marker (animated) */}
            <motion.div
              className="absolute"
              animate={{
                left: ['15%', '40%', '65%', '85%'],
                top: ['75%', '50%', '55%', '30%'],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-emerald text-white shadow-glow">
                  🏍️
                </div>
                <span className="absolute -inset-1 rounded-full border-2 border-emerald-500/40 animate-ping" />
              </div>
            </motion.div>

            {/* Home marker */}
            <div className="absolute right-[12%] top-[25%] flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg">
                🏠
              </div>
              <span className="text-[9px] font-bold bg-white/90 dark:bg-black/70 px-1 rounded mt-0.5">Home</span>
            </div>

            {/* Live badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE TRACKING
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center justify-between mb-4">
            {statusSteps.map((step, i) => {
              const Icon = step.icon
              const activeIndex = statusSteps.findIndex((s) => s.id === activeOrder.status)
              const isActive = i <= activeIndex
              return (
                <div key={step.id} className="flex flex-col items-center gap-1 flex-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'gradient-emerald text-primary-foreground shadow-glow' : 'bg-accent text-muted-foreground'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`text-[9px] text-center font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                  {i < statusSteps.length - 1 && (
                    <div className="absolute" style={{ left: `${(i + 1) * 20}%` }}>
                      {/* connector handled by flex */}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Driver info */}
          {activeOrder.driver && (
            <div className="rounded-2xl bg-accent/40 p-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-emerald text-primary-foreground font-bold text-lg">
                {activeOrder.driver.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{activeOrder.driver.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {activeOrder.driver.rating}
                  </span>
                  <span>•</span>
                  <span className="truncate">{activeOrder.driver.vehicle}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.info('Calling driver...', { description: activeOrder.driver?.phone })}
                  className="flex h-10 w-10 items-center justify-center rounded-xl gradient-emerald text-primary-foreground tap-highlight-none hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Call driver"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toast.info('Opening chat with driver')}
                  className="flex h-10 w-10 items-center justify-center rounded-xl glass tap-highlight-none hover:shadow-premium"
                  aria-label="Chat with driver"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Order items */}
          <div className="mt-3 space-y-2">
            {activeOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-accent/20 p-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-xl">
                  {item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                </div>
                <div className="font-bold text-sm">{(item.price * item.quantity).toLocaleString()} ETB</div>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent/20 p-3">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-muted-foreground">Delivery Address</div>
              <div className="text-sm font-medium">{activeOrder.deliveryAddress}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Past orders */}
      <div>
        <h2 className="text-lg font-black mb-3">Past Orders</h2>
        <div className="space-y-3">
          {pastOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl glass p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-sm">{order.id}</div>
                  <div className="text-xs text-muted-foreground">{order.date} • {order.vendor}</div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3 w-3" /> {t(language, 'delivered')}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {order.items.map((item, j) => (
                  <div key={j} className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg">
                    {item.image}
                  </div>
                ))}
                <div className="ml-auto text-right">
                  <div className="font-black">{order.total.toLocaleString()} ETB</div>
                  <div className="text-[10px] text-muted-foreground">{order.paymentMethod}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toast.success('Added to cart for reorder!')}
                  className="flex-1 rounded-lg gradient-emerald py-2 text-xs font-bold text-primary-foreground tap-highlight-none"
                >
                  Reorder
                </button>
                <button className="flex-1 rounded-lg glass py-2 text-xs font-bold hover:shadow-premium">
                  <Receipt className="h-3 w-3 inline mr-1" /> Invoice
                </button>
                <button className="flex items-center justify-center rounded-lg glass px-3 py-2 hover:shadow-premium">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => setView('home')}
        className="w-full rounded-2xl glass p-4 text-center font-semibold hover:shadow-premium transition-all tap-highlight-none"
      >
        Continue Shopping
      </button>
    </div>
  )
}
