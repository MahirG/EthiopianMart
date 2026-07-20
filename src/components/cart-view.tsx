'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, ChevronRight, CreditCard, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'
import { CategoryGlyph } from './category-glyph'

const payments = [
  ['telebirr', 'Telebirr', 'Mobile payment'], ['cbe', 'CBE Birr', 'Bank wallet'], ['chapa', 'Chapa', 'Secure gateway'], ['santim', 'SantimPay', 'Digital payment'], ['cod', 'Cash', 'Pay on delivery'],
] as const

export function CartView() {
  const { data: session } = useSession()
  const { cart, updateQty, removeFromCart, clearCart, cartTotal, setView, appliedCoupon, applyCoupon, removeCoupon, openAuth } = useAppStore()
  const [step, setStep] = useState<'cart' | 'delivery' | 'payment' | 'success'>('cart')
  const [payment, setPayment] = useState('telebirr')
  const [coupon, setCoupon] = useState('')
  const [placing, setPlacing] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [address, setAddress] = useState({ fullName: '', phone: '', city: 'Addis Ababa', area: '', details: '' })

  const subtotal = cartTotal()
  const deliveryFee = subtotal >= 500 ? 0 : 50
  const couponDiscount = appliedCoupon ? Math.min(subtotal, appliedCoupon.type === 'percent' ? Math.round(subtotal * appliedCoupon.discount / 100) : appliedCoupon.discount) : 0
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount)

  const startCheckout = () => {
    if (!session?.user) { toast.info('Sign in to checkout'); openAuth('login'); return }
    setStep('delivery')
  }
  const continueToPayment = () => {
    if (!address.fullName || !address.phone || !address.city || !address.details) { toast.error('Complete the required delivery fields'); return }
    setStep('payment')
  }
  const placeOrder = async () => {
    setPlacing(true)
    try {
      const addressResponse = await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...address, isDefault: false }) })
      const savedAddress = await addressResponse.json()
      if (!addressResponse.ok) throw new Error(savedAddress.error || 'Could not save delivery address')

      const orderResponse = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: savedAddress.id, paymentMethod: payment, couponCode: appliedCoupon?.code,
          items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        }),
      })
      const order = await orderResponse.json()
      if (!orderResponse.ok) throw new Error(order.error || 'Could not place order')
      setOrderNumber(order.orderNumber)
      clearCart()
      setStep('success')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed')
    } finally { setPlacing(false) }
  }

  if (step === 'success') return <div className="mx-auto flex min-h-[500px] max-w-lg flex-col items-center justify-center text-center"><span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-9 w-9" /></span><h1 className="mt-6 text-3xl font-black">Order confirmed</h1><p className="mt-2 text-sm text-muted-foreground">Your order <strong className="text-foreground">{orderNumber}</strong> is now in EthiopianMart.</p><div className="mt-7 flex gap-3"><button onClick={() => { setStep('cart'); setView('orders') }} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Track order</button><button onClick={() => { setStep('cart'); setView('search') }} className="rounded-full border border-border px-5 py-3 text-sm font-bold">Keep shopping</button></div></div>

  if (!cart.length) return <div className="mx-auto flex min-h-[480px] max-w-lg flex-col items-center justify-center text-center"><span className="grid h-20 w-20 place-items-center rounded-3xl bg-muted"><ShoppingBag className="h-8 w-8 text-primary" /></span><h1 className="mt-6 text-2xl font-black">Your cart is ready when you are</h1><p className="mt-2 text-sm text-muted-foreground">Browse the live catalog and add products from trusted sellers.</p><button onClick={() => setView('search')} className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Start shopping</button></div>

  return (
    <div className="mx-auto max-w-5xl pb-8">
      <div className="flex items-end justify-between border-b border-border pb-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Checkout</p><h1 className="mt-2 text-3xl font-black">{step === 'cart' ? 'Your cart' : step === 'delivery' ? 'Delivery details' : 'Payment'}</h1></div><p className="text-sm text-muted-foreground">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p></div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          {step === 'cart' && <div className="divide-y divide-border rounded-2xl border border-border bg-card">{cart.map((item) => <div key={item.product.id} className="flex gap-4 p-4"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#f1e9d7] text-primary dark:bg-muted">{item.product.image ? <img src={item.product.image} alt="" className="h-full w-full rounded-2xl object-cover" /> : <CategoryGlyph category={item.product.category} className="h-9 w-9" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{item.product.name}</p><p className="mt-1 text-xs text-muted-foreground">{item.product.vendor}</p><div className="mt-3 flex items-center gap-1"><button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-border"><Minus className="h-3.5 w-3.5" /></button><span className="w-8 text-center text-sm font-black">{item.quantity}</span><button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-border"><Plus className="h-3.5 w-3.5" /></button><button onClick={() => removeFromCart(item.product.id)} className="ml-2 grid h-8 w-8 place-items-center text-destructive"><Trash2 className="h-4 w-4" /></button></div></div><p className="text-sm font-black">{(item.product.price * item.quantity).toLocaleString()} ETB</p></div>)}</div>}

          {step === 'delivery' && <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">{[
            ['fullName', 'Full name', 'text'], ['phone', 'Phone number', 'tel'], ['city', 'City', 'text'], ['area', 'Area / sub-city', 'text'],
          ].map(([field, label, type]) => <label key={field} className="grid gap-2 text-xs font-bold">{label}{field === 'area' && <span className="font-normal text-muted-foreground">Optional</span>}<input type={type} value={address[field as keyof typeof address]} onChange={(event) => setAddress({ ...address, [field]: event.target.value })} className="rounded-xl border border-border bg-background px-3 py-3 font-normal outline-none focus:border-primary" required={field !== 'area'} /></label>)}<label className="grid gap-2 text-xs font-bold sm:col-span-2">Detailed address<textarea value={address.details} onChange={(event) => setAddress({ ...address, details: event.target.value })} rows={4} className="rounded-xl border border-border bg-background px-3 py-3 font-normal outline-none focus:border-primary" placeholder="Street, landmark, building and unit" /></label></div>}

          {step === 'payment' && <div className="grid gap-3 sm:grid-cols-2">{payments.map(([id, name, description]) => <button key={id} onClick={() => setPayment(id)} className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${payment === id ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'border-border bg-card'}`}><CreditCard className="h-5 w-5 text-primary" /><div><p className="text-sm font-extrabold">{name}</p><p className="text-xs text-muted-foreground">{description}</p></div>{payment === id && <Check className="ml-auto h-4 w-4 text-primary" />}</button>)}</div>}

          <div className="mt-6 flex gap-3">{step !== 'cart' && <button onClick={() => setStep(step === 'payment' ? 'delivery' : 'cart')} className="rounded-full border border-border px-5 py-3 text-sm font-bold">Back</button>}<button onClick={step === 'cart' ? startCheckout : step === 'delivery' ? continueToPayment : placeOrder} disabled={placing} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground disabled:opacity-50">{placing ? 'Placing order…' : step === 'cart' ? 'Continue to checkout' : step === 'delivery' ? 'Continue to payment' : 'Place order'}{!placing && <ChevronRight className="h-4 w-4" />}</button></div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-40"><h2 className="text-sm font-extrabold">Order summary</h2><div className="mt-5 grid gap-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><strong>{subtotal.toLocaleString()} ETB</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><strong>{deliveryFee ? `${deliveryFee} ETB` : 'Free'}</strong></div>{couponDiscount > 0 && <div className="flex justify-between text-primary"><span>{appliedCoupon?.code}</span><strong>−{couponDiscount.toLocaleString()} ETB</strong></div>}<div className="mt-2 flex justify-between border-t border-border pt-4 text-base"><strong>Total</strong><strong>{total.toLocaleString()} ETB</strong></div></div>
          {!appliedCoupon ? <div className="mt-5 flex gap-2"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Coupon code" className="min-w-0 flex-1 rounded-xl border border-border px-3 text-sm uppercase outline-none" /><button onClick={() => { if (applyCoupon(coupon)) { toast.success('Coupon applied'); setCoupon('') } else toast.error('Coupon is invalid or below its minimum') }} className="rounded-xl bg-muted px-3 py-2 text-xs font-bold">Apply</button></div> : <button onClick={removeCoupon} className="mt-4 text-xs font-bold text-destructive">Remove coupon</button>}
          <div className="mt-6 grid gap-3 border-t border-border pt-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure authenticated checkout</span><span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Stock validated before confirmation</span></div>
        </aside>
      </div>
    </div>
  )
}
