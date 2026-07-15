'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { paymentMethods } from '@/lib/data'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2, Plus, Minus, ShoppingBag, Tag, Truck, Shield, Check,
  ChevronRight, Sparkles, CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export function CartView() {
  const { language, cart, updateQty, removeFromCart, cartTotal, clearCart, setView, addSavings, appliedCoupon, applyCoupon, removeCoupon, openAuth } = useAppStore()

  // Read step from local state via a workaround — we keep the original logic
  // by storing step in window? No — let's use useState here.
  // Actually we need to preserve the original step state. Let me use useState.
  const [step, setStep] = useStateLocal<'cart' | 'address' | 'payment' | 'success'>('cart')
  const [selectedPayment, setSelectedPayment] = useStateLocal('telebirr')
  const [couponInput, setCouponInput] = useStateLocal('')

  const subtotal = cartTotal()
  const deliveryFee = subtotal > 500 ? 0 : 50
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(subtotal * appliedCoupon.discount / 100)
      : appliedCoupon.discount
    : 0
  const total = subtotal + deliveryFee - couponDiscount
  const savings = cart.reduce((sum, i) => sum + (i.product.bundleSavings || 0) * i.quantity, 0)

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return
    const success = applyCoupon(couponInput)
    if (success) {
      toast.success(`Coupon "${couponInput.toUpperCase()}" applied! 🎉`)
      setCouponInput('')
    } else {
      toast.error('Invalid coupon code or minimum order not met')
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    // Check if user is authenticated
    const res = await fetch('/api/auth/session')
    const session = await res.json()
    if (!session?.user) {
      toast.info('Please sign in to checkout')
      openAuth('login')
      return
    }
    setStep('address')
  }

  const handlePlaceOrder = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: selectedPayment,
          couponCode: appliedCoupon?.code,
          deliveryFee,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order')
      }

      addSavings(savings)
      toast.success('Order placed successfully! 🎉', {
        description: `Order ${data.orderNumber} • You saved ${savings} ETB`,
      })
      clearCart()
      setStep('success')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order')
    }
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full gradient-emerald shadow-glow"
        >
          <Check className="h-12 w-12 text-primary-foreground" strokeWidth={3} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black mb-2 font-display tracking-tight"
        >
          Order Confirmed! 🎉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-1"
        >
          Thank you for shopping with Gulit.shop
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6"
        >
          You saved {savings.toLocaleString()} ETB with smart bundles!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <button
            onClick={() => { setStep('cart'); setView('orders') }}
            className="rounded-full gradient-emerald px-6 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Track Order
          </button>
          <button
            onClick={() => { setStep('cart'); setView('home') }}
            className="rounded-full glass px-6 py-3 font-semibold hover:shadow-premium transition-shadow"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full glass text-5xl"
        >
          🛒
        </motion.div>
        <h2 className="text-2xl font-black mb-2 font-display tracking-tight">{t(language, 'emptyCart')}</h2>
        <p className="text-muted-foreground mb-6">Browse our amazing deals and start saving!</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.04 }}
          onClick={() => setView('home')}
          className="rounded-full gradient-emerald px-8 py-3 font-semibold text-primary-foreground shadow-glow tap-highlight-none"
        >
          Start Shopping
        </motion.button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black font-display tracking-tight">{t(language, 'yourCart')}</h1>
          <p className="text-sm text-muted-foreground">{cart.length} items • You save {savings.toLocaleString()} ETB</p>
        </div>
        {step === 'cart' && (
          <button
            onClick={clearCart}
            className="text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors tap-highlight-none"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Steps indicator */}
      {step !== 'cart' && (
        <div className="flex items-center gap-2">
          {[
            { id: 'cart', label: 'Cart', n: 1 },
            { id: 'address', label: 'Address', n: 2 },
            { id: 'payment', label: 'Payment', n: 3 },
          ].map((s, i) => {
            const active = step === s.id
            const passed = (['cart', 'address', 'payment'] as const).indexOf(step as 'cart') > i
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    active || passed ? 'gradient-emerald text-primary-foreground shadow-glow' : 'bg-accent text-muted-foreground'
                  }`}
                >
                  {passed ? <Check className="h-4 w-4" /> : s.n}
                </motion.div>
                <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                {i < 2 && <div className={`flex-1 h-0.5 rounded-full transition-colors ${passed ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            )
          })}
        </div>
      )}

      {/* Cart items */}
      {step === 'cart' && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {cart.map((item) => (
            <motion.div
              key={item.product.id}
              variants={itemVariants}
              layout
              className="flex gap-3 rounded-2xl glass p-3"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/40 to-muted text-4xl">
                {item.product.categoryIcon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2 text-balance">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.product.vendor}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 rounded-lg bg-accent p-0.5">
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-background transition-colors tap-highlight-none"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-background transition-colors tap-highlight-none"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 transition-colors tap-highlight-none"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-black text-base tracking-tight">{(item.product.price * item.quantity).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">ETB</div>
                {item.product.originalPrice && (
                  <div className="text-xs text-muted-foreground line-through">
                    {(item.product.originalPrice * item.quantity).toLocaleString()}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* AI bundle savings banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl liquid-glass p-4 relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">AI Bundle Savings</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You&apos;re saving <span className="font-black text-foreground">{savings.toLocaleString()} ETB</span> with smart bundles and deals!
                Add 2 more items to unlock an extra 150 ETB savings.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Address step */}
      {step === 'address' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl glass p-4">
            <h3 className="font-bold mb-3 font-display tracking-tight">Delivery Address</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  defaultValue="Abebe Bekele"
                  className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition-shadow"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+251 911 234 567"
                  className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition-shadow"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">City</label>
                <select className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition-shadow">
                  <option>Addis Ababa</option>
                  <option>Adama</option>
                  <option>Bahir Dar</option>
                  <option>Hawassa</option>
                  <option>Mekelle</option>
                  <option>Jimma</option>
                  <option>Gondar</option>
                  <option>Dire Dawa</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Detailed Address</label>
                <textarea
                  defaultValue="Bole, near Edna Mall, Building 4, Apt 12"
                  className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition-shadow resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Delivery options */}
          <div className="rounded-2xl glass p-4">
            <h3 className="font-bold mb-3 font-display tracking-tight">Delivery Option</h3>
            <div className="space-y-2">
              {[
                { id: 'express', label: 'Express Delivery', desc: 'Within 2 hours', price: 150, icon: '🚀' },
                { id: 'same', label: 'Same Day Delivery', desc: 'By 6 PM today', price: 80, icon: '⚡' },
                { id: 'standard', label: 'Standard Delivery', desc: '1-3 business days', price: deliveryFee, icon: '🚚', free: deliveryFee === 0 },
                { id: 'pickup', label: 'Store Pickup', desc: 'Pickup from nearest store', price: 0, icon: '🏪', free: true },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 rounded-xl bg-accent/30 p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <input type="radio" name="delivery" defaultChecked={opt.id === 'standard'} className="accent-primary h-4 w-4" />
                  <span className="text-xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.desc}</div>
                  </div>
                  <span className="font-bold text-sm">
                    {opt.free ? <span className="text-emerald-600 dark:text-emerald-400">FREE</span> : `${opt.price} ETB`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment step */}
      {step === 'payment' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl glass p-4">
            <h3 className="font-bold mb-1 flex items-center gap-2 font-display tracking-tight">
              <CreditCard className="h-4 w-4 text-primary" />
              {t(language, 'paymentMethods')}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">All payments are encrypted and secure</p>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((pm) => (
                <motion.button
                  key={pm.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`relative flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all tap-highlight-none ${
                    selectedPayment === pm.id
                      ? 'bg-primary/10 border-2 border-primary shadow-glow'
                      : 'bg-accent/30 border-2 border-transparent hover:bg-accent/50'
                  }`}
                  aria-pressed={selectedPayment === pm.id}
                >
                  {selectedPayment === pm.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full gradient-emerald"
                    >
                      <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${pm.color} text-white shadow-sm`}>
                    {pm.icon}
                  </div>
                  <div className="font-semibold text-sm pr-6">{pm.name}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">{pm.description}</div>
                  {pm.balance !== undefined && (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Balance: {pm.balance.toLocaleString()} ETB
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Security badges */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: 'PCI Compliant' },
              { icon: Check, label: 'Encrypted' },
              { icon: Truck, label: 'Protected' },
            ].map((b, i) => {
              const Icon = b.icon
              return (
                <div key={i} className="flex flex-col items-center gap-1 rounded-xl glass p-3">
                  <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] font-medium text-center">{b.label}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Order summary */}
      <div className="rounded-2xl glass-strong p-4 space-y-2">
        <h3 className="font-bold text-sm mb-2 font-display tracking-tight">Order Summary</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t(language, 'subtotal')}</span>
          <span className="font-semibold tabular-nums">{subtotal.toLocaleString()} ETB</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t(language, 'deliveryFee')}</span>
          {deliveryFee === 0 ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
          ) : (
            <span className="font-semibold tabular-nums">{deliveryFee} ETB</span>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" /> Bundle Savings
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">-{savings.toLocaleString()} ETB</span>
        </div>
        {appliedCoupon && couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Tag className="h-3 w-3" /> Coupon ({appliedCoupon.code})
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">-{couponDiscount.toLocaleString()} ETB</span>
              <button
                onClick={() => { removeCoupon(); toast.info('Coupon removed') }}
                className="text-xs text-destructive hover:underline tap-highlight-none"
                aria-label="Remove coupon"
              >
                Remove
              </button>
            </span>
          </div>
        )}
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between items-baseline">
          <span className="font-bold">{t(language, 'total')}</span>
          <div>
            <span className="text-xl font-black tabular-nums">{total.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground ml-1">ETB</span>
          </div>
        </div>
      </div>

      {/* Coupon input */}
      {step === 'cart' && !appliedCoupon && (
        <div className="rounded-2xl glass p-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Have a coupon code?</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              placeholder="e.g. WELCOME10"
              className="flex-1 rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary transition-shadow uppercase"
              aria-label="Coupon code"
            />
            <button
              onClick={handleApplyCoupon}
              className="rounded-xl gradient-emerald px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow tap-highlight-none"
            >
              Apply
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[10px] text-muted-foreground">Try:</span>
            {['WELCOME10', 'COFFEE23', 'FRIDAY18'].map((c) => (
              <button
                key={c}
                onClick={() => { setCouponInput(c); }}
                className="rounded-full bg-accent hover:bg-accent/70 px-2 py-0.5 text-[10px] font-bold transition-colors tap-highlight-none"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-2">
        {step !== 'cart' && (
          <button
            onClick={() => setStep(step === 'payment' ? 'address' : 'cart')}
            className="rounded-full glass px-6 py-3 font-semibold hover:shadow-premium transition-shadow tap-highlight-none"
          >
            Back
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => {
            if (step === 'cart') handleCheckout()
            else if (step === 'address') setStep('payment')
            else if (step === 'payment') handlePlaceOrder()
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-full gradient-emerald px-6 py-3 font-bold text-primary-foreground shadow-glow tap-highlight-none"
        >
          {step === 'cart' && <>{t(language, 'checkout')} <ChevronRight className="h-4 w-4" /></>}
          {step === 'address' && <>Continue to Payment <ChevronRight className="h-4 w-4" /></>}
          {step === 'payment' && <><Check className="h-4 w-4" /> Place Order</>}
        </motion.button>
      </div>
    </div>
  )
}

// Local useState helper to avoid import conflicts
import { useState } from 'react'
function useStateLocal<T>(initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  return useState(initial) as [T, (v: T | ((prev: T) => T)) => void]
}
