'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, BadgeCheck, Heart, Minus, PackageCheck, Plus, Share2, Star, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { mapApiProduct } from '@/lib/catalog'
import { useAppStore } from '@/lib/store'
import { ProductCard } from './product-card'
import { CategoryGlyph } from './category-glyph'

type ProductDetail = {
  id: string; name: string; description: string; shortDescription: string | null; price: number; originalPrice: number | null;
  categoryIcon: string; images: string; specs: string; warranty: string | null; stock: number; unlimitedStock: boolean;
  deliveryDays: number; rating: number; reviewCount: number; isLocal: boolean; isOrganic: boolean; isHandmade: boolean;
  category: { name: string; slug: string }; vendor: { name: string } | null; vendorId: string | null; countryOfOrigin: string | null;
  tags: string; variants: Array<{ id: string; name: string; value: string; stock: number; price: number }>;
  reviews: Array<{ id: string; rating: number; title: string | null; comment: string; verified: boolean; createdAt: string; user: { name: string } }>;
  related: Parameters<typeof mapApiProduct>[0][];
}

function parseArray<T>(value: string): T[] {
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : [] } catch { return [] }
}

async function fetchProduct(id: string): Promise<ProductDetail> {
  const response = await fetch(`/api/products/${id}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Product could not be loaded')
  return data
}

export function ProductDetailView() {
  const { selectedProduct, setView, addToCart, wishlist, toggleWishlist } = useAppStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const query = useQuery({ queryKey: ['product-detail', selectedProduct?.id], queryFn: () => fetchProduct(selectedProduct!.id), enabled: Boolean(selectedProduct) })

  if (!selectedProduct) return <EmptyProduct onBack={() => setView('search')} />
  if (query.isLoading) return <div className="grid min-h-[520px] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
  if (query.isError || !query.data) return <EmptyProduct onBack={() => setView('search')} message={query.error instanceof Error ? query.error.message : undefined} />

  const detail = query.data
  const product = { ...selectedProduct, rating: detail.rating, reviewCount: detail.reviewCount, inStock: detail.unlimitedStock || detail.stock > 0 }
  const images = parseArray<string>(detail.images)
  const specs = parseArray<{ label: string; value: string }>(detail.specs)
  const related = detail.related.map(mapApiProduct)
  const wishlisted = wishlist.includes(product.id)

  const add = () => {
    addToCart(product, quantity)
    toast.success('Added to cart', { description: `${quantity} × ${product.name}` })
  }
  const share = async () => {
    const url = window.location.href
    if (navigator.share) await navigator.share({ title: product.name, url })
    else { await navigator.clipboard.writeText(url); toast.success('Product link copied') }
  }

  return (
    <div className="space-y-12 pb-8">
      <button onClick={() => setView('search')} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to shop</button>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
        <div className="relative grid min-h-[420px] place-items-center overflow-hidden rounded-[28px] bg-[#f1e9d7] dark:bg-muted sm:min-h-[560px]">
          {images[0] ? <img src={images[0]} alt={detail.name} className="h-full w-full object-cover" /> : <CategoryGlyph category={detail.category.slug} className="h-24 w-24 text-primary sm:h-32 sm:w-32" />}
          {detail.isLocal && <span className="absolute left-5 top-5 rounded-full bg-[#0f5132] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white">Made in Ethiopia</span>}
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-xs font-bold text-primary"><BadgeCheck className="h-4 w-4" /> {detail.vendor?.name ?? 'Independent seller'}</p>
            <div className="flex gap-2"><button onClick={() => toggleWishlist(product.id)} className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Toggle wishlist"><Heart className={`h-4 w-4 ${wishlisted ? 'fill-[#c84a34] text-[#c84a34]' : ''}`} /></button><button onClick={share} className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Share product"><Share2 className="h-4 w-4" /></button></div>
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{detail.category.name}</p>
          <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-5xl">{detail.name}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm">{detail.reviewCount > 0 ? <><span className="flex items-center gap-1 font-bold"><Star className="h-4 w-4 fill-[#e3a921] text-[#e3a921]" /> {detail.rating.toFixed(1)}</span><span className="text-muted-foreground">{detail.reviewCount} verified reviews</span></> : <span className="text-muted-foreground">New product</span>}</div>
          <p className="mt-6 text-sm leading-7 text-muted-foreground">{detail.shortDescription || detail.description}</p>

          {detail.variants.length > 0 && <div className="mt-6"><p className="text-xs font-extrabold uppercase tracking-wide">Choose an option</p><div className="mt-3 flex flex-wrap gap-2">{detail.variants.map((variant) => <button key={variant.id} disabled={variant.stock === 0} onClick={() => setSelectedVariant(variant.id)} className={`rounded-full border px-4 py-2 text-xs font-bold disabled:opacity-40 ${selectedVariant === variant.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{variant.name}: {variant.value}</button>)}</div></div>}

          <div className="mt-8 flex items-end gap-3"><span className="text-3xl font-black tracking-[-0.05em]">{detail.price.toLocaleString()}</span><span className="mb-1 text-xs font-bold text-muted-foreground">ETB</span>{detail.originalPrice && <span className="mb-1 text-sm text-muted-foreground line-through">{detail.originalPrice.toLocaleString()} ETB</span>}</div>
          <div className="mt-7 flex gap-3">
            <div className="flex items-center rounded-full border border-border"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid h-12 w-11 place-items-center"><Minus className="h-4 w-4" /></button><span className="w-8 text-center text-sm font-black">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="grid h-12 w-11 place-items-center"><Plus className="h-4 w-4" /></button></div>
            <button onClick={add} disabled={!product.inStock} className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground disabled:bg-muted disabled:text-muted-foreground">{product.inStock ? 'Add to cart' : 'Out of stock'}</button>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 border-t border-border pt-6 text-xs"><span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Delivery in {detail.deliveryDays}–{detail.deliveryDays + 1} days</span><span className="flex items-center gap-2"><PackageCheck className="h-4 w-4 text-primary" /> Stock-aware checkout</span></div>
        </div>
      </section>

      <section className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[1fr_.7fr]">
        <div><h2 className="text-2xl font-black">Product details</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{detail.description}</p>{specs.length > 0 && <dl className="mt-6 divide-y divide-border rounded-2xl border border-border">{specs.map((spec) => <div key={spec.label} className="grid grid-cols-2 gap-4 p-4 text-sm"><dt className="font-bold">{spec.label}</dt><dd className="text-muted-foreground">{spec.value}</dd></div>)}</dl>}{detail.warranty && <p className="mt-5 text-sm"><strong>Warranty:</strong> {detail.warranty}</p>}</div>
        <div><h2 className="text-2xl font-black">Customer reviews</h2><div className="mt-4 grid gap-3">{detail.reviews.length ? detail.reviews.map((review) => <article key={review.id} className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center justify-between"><strong className="text-sm">{review.user.name}</strong><span className="flex items-center gap-1 text-xs font-bold"><Star className="h-3.5 w-3.5 fill-[#e3a921] text-[#e3a921]" /> {review.rating}</span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>{review.verified && <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-primary">Verified purchase</p>}</article>) : <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">No reviews yet.</p>}</div></div>
      </section>

      {related.length > 0 && <section><h2 className="text-2xl font-black">You may also like</h2><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{related.map((item, index) => <ProductCard key={item.id} product={item} index={index} />)}</div></section>}
    </div>
  )
}

function EmptyProduct({ onBack, message = 'Choose a product from the live catalog.' }: { onBack: () => void; message?: string }) {
  return <div className="grid min-h-[420px] place-items-center text-center"><div><h1 className="text-2xl font-black">Product unavailable</h1><p className="mt-2 text-sm text-muted-foreground">{message}</p><button onClick={onBack} className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Return to shop</button></div></div>
}
