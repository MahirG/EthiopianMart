'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { paymentMethods } from '@/lib/data'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Trash2, Plus, Minus, ShoppingBag, Tag, Truck, Shield, Check,
  ChevronRight, Sparkles, X, CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'

export function CartView() {
  const { language, cart, updateQty, removeFromCart, cartTotal, clearCart, setView, addSavings } = useAppStore()
  const [step, setStep] = useState<'cart' | 'address' | 'payment' | 'success'>('cart')
  const [selectedPayment, setSelectedPayment] = useState('telebirr')

  const subtotal = cartTotal()
  const deliveryFee = subtotal > 500 ? 0 : 50
  const total = subtotal + deliveryFee
  const savings = cart.reduce((sum, i) => sum + (i.product.bundleSavings || 0) * i.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    setStep('address')
  }

  const handlePlaceOrder = () => {
    addSavings(savings)
    toast.success('Order placed successfully! 🎉', {
      description: `You saved ${savings} ETB. Track your delivery in Orders.`,
    })
    clearCart()
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full gradient-emerald shadow-glow"
        >
          <Check className="h-12 w-12 text-primary-foreground" strokeWidth={3} />
        </motion.div>
        <h2 className="text-2xl font-black mb-2">Order Confirmed! 🎉</h2>
        <p className="text-muted-foreground mb-1">Thank you for shopping with Gebeya</p>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6">
          You saved {savings.toLocaleString()} ETB with smart bundles!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => { setStep('cart'); setView('orders') }}
            className="rounded-full gradient-emerald px-6 py-3 font-semibold text-primary-foreground shadow-glow"
          >
            Track Order
          </button>
          <button
            onClick={() => { setStep('cart'); setView('home') }}
            className="rounded-full glass px-6 py-3 font-semibold hover:shadow-premium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent text-5xl"
        >
          🛒
        </motion.div>
        <h2 className="text-2xl font-black mb-2">{t(language, 'emptyCart')}</h2>
        <p className="text-muted-foreground mb-6">Browse our amazing deals and start saving!</p>
        <button
          onClick={() => setView('home')}
          className="rounded-full gradient-emerald px-8 py-3 font-semibold text-primary-foreground shadow-glow hover:scale-105 active:scale-95 transition-transform"
        >
          Start Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">{t(language, 'yourCart')}</h1>
          <p className="text-sm text-muted-foreground">{cart.length} items • You save {savings.toLocaleString()} ETB</p>
        </div>
        {step === 'cart' && (
          <button
            onClick={clearCart}
            className="text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-colors"
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
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                step === s.id ? 'gradient-emerald text-primary-foreground' : 'bg-accent text-muted-foreground'
              }`}>
                {s.n}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
              {i < 2 && <div className="flex-1 h-0.5 bg-border" />}
            </div>
          ))}
        </div>
      )}

      {/* Cart items */}
      {step === 'cart' && (
        <div className="space-y-3">
          {cart.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 rounded-2xl glass p-3"
            >
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/50 to-muted text-4xl">
                {item.product.categoryIcon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2">{item.product.name}</h3>
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
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
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
                <div className="font-black text-base">{(item.product.price * item.quantity).toLocaleString()}</div>
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
            className="rounded-2xl gradient-emerald p-4 text-primary-foreground"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">AI Bundle Savings</span>
            </div>
            <p className="text-sm text-white/90">
              You're saving <span className="font-black">{savings.toLocaleString()} ETB</span> with smart bundles and deals!
              Add 2 more items to unlock an extra 150 ETB savings.
            </p>
          </motion.div>
        </div>
      )}

      {/* Address step */}
      {step === 'address' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass p-4">
            <h3 className="font-bold mb-3">Delivery Address</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  defaultValue="Abebe Bekele"
                  className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  defaultValue="+251 911 234 567"
                  className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">City</label>
                <select className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary">
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
                  className="mt-1 w-full rounded-xl bg-accent/50 px-3 py-2 text-sm outline-none focus:ring-2 ring-primary resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Delivery options */}
          <div className="rounded-2xl glass p-4">
            <h3 className="font-bold mb-3">Delivery Option</h3>
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
                  <input type="radio" name="delivery" defaultChecked={opt.id === 'standard'} className="accent-primary" />
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
        </div>
      )}

      {/* Payment step */}
      {step === 'payment' && (
        <div className="space-y-4">
          <div className="rounded-2xl glass p-4">
            <h3 className="font-bold mb-1 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              {t(language, 'paymentMethods')}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">All payments are encrypted and secure</p>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setSelectedPayment(pm.id)}
                  className={`relative flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all tap-highlight-none ${
                    selectedPayment === pm.id
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-accent/30 border-2 border-transparent hover:bg-accent/50'
                  }`}
                >
                  {selectedPayment === pm.id && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full gradient-emerald">
                      <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                    </div>
                  )}
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${pm.color} text-white`}>
                    {pm.icon}
                  </div>
                  <div className="font-semibold text-sm pr-6">{pm.name}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-1">{pm.description}</div>
                  {pm.balance !== undefined && (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Balance: {pm.balance.toLocaleString()} ETB
                    </div>
                  )}
                </button>
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
        </div>
      )}

      {/* Order summary */}
      <div className="rounded-2xl glass-strong p-4 space-y-2">
        <h3 className="font-bold text-sm mb-2">Order Summary</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t(language, 'subtotal')}</span>
          <span className="font-semibold">{subtotal.toLocaleString()} ETB</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t(language, 'deliveryFee')}</span>
          {deliveryFee === 0 ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">FREE</span>
          ) : (
            <span className="font-semibold">{deliveryFee} ETB</span>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" /> Bundle Savings
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">-{savings.toLocaleString()} ETB</span>
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between items-baseline">
          <span className="font-bold">{t(language, 'total')}</span>
          <div>
            <span className="text-xl font-black">{total.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground ml-1">ETB</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-2">
        {step !== 'cart' && (
          <button
            onClick={() => setStep(step === 'payment' ? 'address' : 'cart')}
            className="rounded-full glass px-6 py-3 font-semibold hover:shadow-premium"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step === 'cart') handleCheckout()
            else if (step === 'address') setStep('payment')
            else if (step === 'payment') handlePlaceOrder()
          }}
          className="flex-1 flex items-center justify-center gap-2 rounded-full gradient-emerald px-6 py-3 font-bold text-primary-foreground shadow-glow hover:scale-[1.02] active:scale-95 transition-transform tap-highlight-none"
        >
          {step === 'cart' && <>{t(language, 'checkout')} <ChevronRight className="h-4 w-4" /></>}
          {step === 'address' && <>Continue to Payment <ChevronRight className="h-4 w-4" /></>}
          {step === 'payment' && <><Check className="h-4 w-4" /> Place Order</>}
        </button>
      </div>
    </div>
  )
}
