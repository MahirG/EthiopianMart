'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { products, productReviews, productSpecs, productVariants, frequentlyBoughtTogether } from '@/lib/data'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Heart, Share2, Star, MapPin, Truck, Shield, Check,
  Plus, Minus, Sparkles, TrendingDown, Clock, Award, ShoppingBag,
  ChevronRight, Zap, Eye, ThumbsUp, Store,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ProductDetailView() {
  const { language, selectedProduct, addToCart, wishlist, toggleWishlist, setView, setAiOpen } = useAppStore()
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    Size: 'Medium',
    Color: 'Default',
  })
  const [activeImage, setActiveImage] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (!selectedProduct) {
    setView('home')
    return null
  }

  const p = selectedProduct
  const isWishlisted = wishlist.includes(p.id)
  const savings = (p.originalPrice || p.price) - p.price

  // Gallery images — we use the emoji + variations
  const galleryImages = [p.categoryIcon, '📦', '🎯', '✨']

  // Related products — same category, excluding current
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)
  const fbtTotal = frequentlyBoughtTogether.reduce((sum, x) => sum + x.price, 0) + p.price

  const handleAddToCart = () => {
    addToCart(p, qty)
    toast.success(`${p.name} added to cart!`)
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <button onClick={() => setView('home')} className="hover:text-primary transition-colors">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => setView('search')} className="hover:text-primary transition-colors capitalize">{p.category}</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">{p.name}</span>
      </nav>

      {/* Back button (mobile) */}
      <button
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-sm font-semibold tap-highlight-none lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Main product section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative aspect-square overflow-hidden rounded-3xl glass shadow-premium cursor-zoom-in ${zoomed ? 'cursor-zoom-out' : ''}`}
            onClick={() => setZoomed(!zoomed)}
          >
            <motion.div
              animate={{ scale: zoomed ? 1.8 : 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute inset-0 flex items-center justify-center text-9xl bg-gradient-to-br from-accent/40 via-muted to-accent/30"
            >
              {galleryImages[activeImage]}
            </motion.div>

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full glass-strong px-2.5 py-1 text-[10px] font-semibold">
              <Eye className="h-3 w-3" /> {zoomed ? 'Click to zoom out' : 'Click to zoom'}
            </div>

            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {p.discount && (
                <span className="rounded-full gradient-gold px-3 py-1 text-xs font-bold text-white shadow-glow-gold">
                  −{p.discount}% OFF
                </span>
              )}
              {p.isLocal && (
                <span className="rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  🇪🇹 Local Product
                </span>
              )}
              {p.isHandmade && (
                <span className="rounded-full bg-amber-700/95 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  ✋ Handmade
                </span>
              )}
            </div>
          </motion.div>

          {/* Thumbnail gallery */}
          <div className="grid grid-cols-4 gap-2">
            {galleryImages.map((img, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveImage(i); setZoomed(false) }}
                className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${
                  activeImage === i ? 'glass-strong shadow-glow ring-2 ring-primary' : 'glass hover:shadow-premium'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                {img}
              </motion.button>
            ))}
          </div>

          {/* Video placeholder */}
          <button
            onClick={() => toast.info('Product video would play here')}
            className="w-full flex items-center justify-center gap-2 rounded-2xl glass p-4 text-sm font-semibold hover:shadow-premium transition-shadow tap-highlight-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-emerald text-primary-foreground">
              ▶
            </div>
            Watch product video
          </button>
        </div>

        {/* Product info */}
        <div className="space-y-4">
          {/* Rating & stock */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{p.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({p.reviewCount.toLocaleString()} reviews)</span>
            <span className="text-muted-foreground">•</span>
            {p.inStock ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                <Check className="h-3.5 w-3.5" /> In Stock
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-medium text-xs">Out of Stock</span>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight font-display tracking-tight text-balance">{p.name}</h1>
            {p.nameAm && <p className="text-sm text-muted-foreground mt-1">{p.nameAm}</p>}
          </div>

          {/* Vendor */}
          <button className="flex items-center gap-2 rounded-xl glass p-2.5 w-full hover:shadow-premium transition-all tap-highlight-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-emerald text-primary-foreground font-bold text-sm">
              {p.vendor.charAt(0)}
            </div>
            <div className="flex-1 text-left">
              <div className="font-bold text-sm flex items-center gap-1">
                {p.vendor}
                <Check className="h-3 w-3 text-primary" />
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {p.location}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Price */}
          <div className="flex items-end gap-3 flex-wrap">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight">{p.price.toLocaleString()}</span>
              <span className="text-sm font-medium text-muted-foreground">ETB</span>
            </div>
            {p.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through mb-1">{p.originalPrice.toLocaleString()}</span>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  Save {savings.toLocaleString()} ETB
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          <div className="space-y-3">
            {productVariants.map((variant) => (
              <div key={variant.id}>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {variant.name}: <span className="text-foreground">{selectedVariants[variant.name]}</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants((v) => ({ ...v, [variant.name]: opt }))}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all tap-highlight-none ${
                        selectedVariants[variant.name] === opt
                          ? 'gradient-emerald text-primary-foreground shadow-glow'
                          : 'glass hover:shadow-premium'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery estimate */}
          <div className="rounded-2xl glass p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span className="font-semibold">Delivery:</span>
              <span className="text-muted-foreground">{p.deliveryDays} business days to Bole, Addis Ababa</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Order within 4 hrs for same-day dispatch</span>
            </div>
          </div>

          {/* Quantity & actions */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl glass p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors tap-highlight-none"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-bold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors tap-highlight-none"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => toggleWishlist(p.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl tap-highlight-none transition-colors ${
                isWishlisted ? 'bg-destructive/10 text-destructive' : 'glass'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-destructive' : ''}`} />
            </button>
            <button
              onClick={() => toast.success('Link copied!')}
              className="flex h-10 w-10 items-center justify-center rounded-xl glass tap-highlight-none"
              aria-label="Share product"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Total price + buy */}
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Total Price</div>
              <div className="text-xl font-black tabular-nums">{(p.price * qty).toLocaleString()} ETB</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="flex items-center gap-2 rounded-xl glass px-5 py-3 font-bold text-sm tap-highlight-none hover:shadow-premium transition-shadow"
            >
              <ShoppingBag className="h-4 w-4" /> {t(language, 'addtoCart')}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { addToCart(p, qty); setView('cart') }}
              className="flex items-center gap-2 rounded-xl gradient-emerald px-6 py-3 font-bold text-sm text-primary-foreground shadow-glow tap-highlight-none"
            >
              <Zap className="h-4 w-4" /> {t(language, 'buyNow')}
            </motion.button>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Truck, label: t(language, 'freeDelivery'), sub: `${p.deliveryDays} day delivery` },
              { icon: Shield, label: 'Warranty', sub: '1 year guaranteed' },
              { icon: Award, label: 'Quality', sub: 'Verified seller' },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="flex flex-col items-center gap-1 rounded-xl glass p-3 text-center">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="text-[11px] font-bold">{f.label}</div>
                  <div className="text-[9px] text-muted-foreground">{f.sub}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Price Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl gradient-emerald p-5 text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-bold font-display tracking-tight">AI Price Intelligence</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/15 backdrop-blur-md p-3">
              <div className="flex items-center gap-1 text-xs text-white/85 mb-1">
                <TrendingDown className="h-3 w-3" /> Price Prediction
              </div>
              <div className="font-bold text-sm">{p.predictedPriceDrop ? `Drop ${p.predictedPriceDrop}% soon` : 'Stable'}</div>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur-md p-3">
              <div className="flex items-center gap-1 text-xs text-white/85 mb-1">
                <Clock className="h-3 w-3" /> Best Time to Buy
              </div>
              <div className="font-bold text-sm">{p.bestTimeToBuy || 'Anytime'}</div>
            </div>
            {p.bundleSavings && (
              <div className="rounded-xl bg-white/15 backdrop-blur-md p-3 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1 text-xs text-white/85 mb-1">
                  <ShoppingBag className="h-3 w-3" /> Bundle Savings
                </div>
                <div className="font-bold text-sm">Save {p.bundleSavings} ETB</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setAiOpen(true)}
            className="mt-3 w-full rounded-xl bg-white py-2.5 font-bold text-sm text-primary tap-highlight-none flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Ask AI about this product
          </button>
        </div>
      </motion.div>

      {/* Tabs: Description / Specs / Reviews */}
      <div className="rounded-2xl glass overflow-hidden">
        <div className="flex border-b border-border/40">
          {[
            { id: 'description', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'reviews', label: `Reviews (${productReviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors tap-highlight-none ${
                activeTab === tab.id ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                This premium product is sourced directly from {p.vendor} in {p.location}. Every purchase supports local Ethiopian businesses and artisans. Our quality assurance team verifies each product before it reaches your doorstep.
              </p>
              <ul className="mt-4 space-y-2">
                {['Premium quality guaranteed', 'Sourced from verified Ethiopian vendors', 'Secure payment options', 'Fast & tracked delivery'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-2">
              {productSpecs.map((spec) => (
                <div key={spec.label} className="flex justify-between py-2 border-b border-border/30 last:border-0">
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Rating summary */}
              <div className="flex items-center gap-4 pb-4 border-b border-border/30">
                <div className="text-center">
                  <div className="text-4xl font-black">{p.rating}</div>
                  <div className="flex gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${s <= Math.round(p.rating) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">{p.reviewCount.toLocaleString()} reviews</div>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{star}</span>
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <div className="flex-1 h-1.5 rounded-full bg-accent overflow-hidden">
                        <div
                          className="h-full gradient-gold"
                          style={{ width: `${star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : 1}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual reviews */}
              {productReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl glass p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${customerReviewColor(i)} text-white font-bold text-xs`}>
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm">{review.name}</span>
                        {review.verified && (
                          <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            <Check className="h-2.5 w-2.5" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">{review.text}</p>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful})
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frequently Bought Together */}
      <section className="rounded-2xl glass p-5">
        <h3 className="font-bold mb-4 font-display tracking-tight flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Frequently Bought Together
        </h3>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent/40 to-muted text-3xl">
              {p.categoryIcon}
            </div>
            <span className="text-[10px] font-bold max-w-16 truncate">{p.price.toLocaleString()} ETB</span>
          </div>
          <span className="text-xl font-bold text-muted-foreground">+</span>
          {frequentlyBoughtTogether.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-1">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent/40 to-muted text-3xl">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold max-w-16 truncate">{item.price.toLocaleString()} ETB</span>
            </div>
          ))}
          <span className="text-xl font-bold text-muted-foreground">=</span>
          <div className="flex flex-col items-center gap-1">
            <div className="rounded-xl gradient-emerald p-3 text-primary-foreground">
              <div className="text-xs font-bold">Bundle</div>
              <div className="text-sm font-black">{fbtTotal.toLocaleString()}</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Save 530 ETB</span>
          </div>
        </div>
        <button
          onClick={() => { addToCart(p); toast.success('Bundle added to cart!') }}
          className="w-full rounded-xl gradient-emerald py-3 font-bold text-sm text-primary-foreground shadow-glow tap-highlight-none"
        >
          Add Bundle to Cart — {fbtTotal.toLocaleString()} ETB
        </button>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h3 className="text-lg font-black mb-4 font-display tracking-tight flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Related Products
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((rp, i) => (
              <ProductCardLazy key={rp.id} product={rp} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Spacer for sticky bar */}
      <div className="h-24" />
    </div>
  )
}

// Helper for review avatar colors
function customerReviewColor(i: number): string {
  const colors = [
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
  ]
  return colors[i % colors.length]
}

// Lazy import to avoid circular dependency
import { ProductCard } from './product-card'
function ProductCardLazy({ product, index }: { product: import('@/lib/types').Product; index: number }) {
  return <ProductCard product={product} index={index} />
}
