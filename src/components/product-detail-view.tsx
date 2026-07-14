'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Heart, Share2, Star, MapPin, Truck, Shield, Check,
  Plus, Minus, Sparkles, TrendingDown, Clock, Award, ShoppingBag,
  MessageCircle, ChevronRight, Zap,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function ProductDetailView() {
  const { language, selectedProduct, addToCart, wishlist, toggleWishlist, setView, setAiOpen } = useAppStore()
  const [qty, setQty] = useState(1)

  if (!selectedProduct) {
    setView('home')
    return null
  }

  const p = selectedProduct
  const isWishlisted = wishlist.includes(p.id)
  const savings = (p.originalPrice || p.price) - p.price

  return (
    <div className="space-y-6 pb-8">
      {/* Back */}
      <button
        onClick={() => setView('home')}
        className="flex items-center gap-2 text-sm font-semibold tap-highlight-none"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Product image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square sm:aspect-[16/10] overflow-hidden rounded-3xl glass shadow-premium"
      >
        <div className="absolute inset-0 flex items-center justify-center text-9xl bg-gradient-to-br from-accent/40 to-muted">
          {p.categoryIcon}
        </div>

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {p.discount && (
            <span className="rounded-full gradient-gold px-3 py-1 text-xs font-bold text-white shadow-glow-gold">
              -{p.discount}% OFF
            </span>
          )}
          {p.isLocal && (
            <span className="rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              🇪🇹 Local Product
            </span>
          )}
          {p.isHandmade && (
            <span className="rounded-full bg-amber-700/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              ✋ Handmade
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(p.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full glass-strong tap-highlight-none"
            aria-label="Add to wishlist"
          >
            <Heart className={`h-5 w-5 transition-all ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
          </button>
          <button
            onClick={() => toast.success('Link copied!')}
            className="flex h-10 w-10 items-center justify-center rounded-full glass-strong tap-highlight-none"
            aria-label="Share product"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      {/* Product info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="font-bold text-amber-600 dark:text-amber-400">{p.rating}</span>
          </div>
          <span className="text-muted-foreground">({p.reviewCount.toLocaleString()} reviews)</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> In Stock
          </span>
        </div>

        <h1 className="text-2xl font-black leading-tight">{p.name}</h1>
        {p.nameAm && <p className="text-sm text-muted-foreground">{p.nameAm}</p>}

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
        <div className="flex items-end gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black">{p.price.toLocaleString()}</span>
            <span className="text-sm font-medium text-muted-foreground">ETB</span>
          </div>
          {p.originalPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through mb-0.5">{p.originalPrice.toLocaleString()}</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                Save {savings.toLocaleString()} ETB
              </span>
            </>
          )}
        </div>
      </div>

      {/* AI Savings Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl gradient-emerald p-4 text-primary-foreground"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-bold">AI Price Intelligence</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
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
            <div className="rounded-xl bg-white/15 backdrop-blur-md p-3 col-span-2">
              <div className="flex items-center gap-1 text-xs text-white/85 mb-1">
                <ShoppingBag className="h-3 w-3" /> Bundle Savings
              </div>
              <div className="font-bold text-sm">Save {p.bundleSavings} ETB with smart bundle</div>
            </div>
          )}
        </div>
        <button
          onClick={() => setAiOpen(true)}
          className="mt-3 w-full rounded-xl bg-white py-2.5 font-bold text-sm text-primary tap-highlight-none flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4" /> Ask AI about this product
        </button>
      </motion.div>

      {/* Description */}
      <div>
        <h3 className="font-bold mb-2">Description</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Truck, label: t(language, 'freeDelivery'), sub: `${p.deliveryDays} day delivery` },
          { icon: Shield, label: 'Warranty', sub: '1 year guaranteed' },
          { icon: Award, label: 'Quality', sub: 'Verified seller' },
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="flex flex-col items-center gap-1 rounded-2xl glass p-3 text-center">
              <Icon className="h-5 w-5 text-primary" />
              <div className="text-xs font-bold">{f.label}</div>
              <div className="text-[10px] text-muted-foreground">{f.sub}</div>
            </div>
          )
        })}
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-sm">Quantity</span>
        <div className="flex items-center gap-2 rounded-xl glass p-1">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors tap-highlight-none"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors tap-highlight-none"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* AI alternatives */}
      <div className="rounded-2xl glass p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-sm">AI Recommends</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Based on your preferences, here are similar products:
        </p>
        <div className="space-y-2">
          {[
            { name: 'Budget alternative', saving: 'Save 320 ETB', icon: '💡' },
            { name: 'Premium upgrade', saving: '+1,200 ETB', icon: '⭐' },
            { name: 'Bundle deal', saving: 'Save 530 ETB', icon: '🎁' },
          ].map((alt, i) => (
            <button
              key={i}
              onClick={() => toast.info(`${alt.name} - ${alt.saving}`)}
              className="flex w-full items-center gap-3 rounded-xl bg-accent/30 p-3 hover:bg-accent/50 transition-colors tap-highlight-none"
            >
              <span className="text-xl">{alt.icon}</span>
              <span className="flex-1 text-left text-sm font-medium">{alt.name}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{alt.saving}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:left-20 glass-strong border-t border-border/40 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Total Price</div>
            <div className="text-xl font-black">{(p.price * qty).toLocaleString()} ETB</div>
          </div>
          <button
            onClick={() => {
              addToCart(p, qty)
              toast.success(`${p.name} added to cart!`)
            }}
            className="flex items-center gap-2 rounded-xl glass px-5 py-3 font-bold text-sm tap-highlight-none hover:shadow-premium"
          >
            <ShoppingBag className="h-4 w-4" /> {t(language, 'addtoCart')}
          </button>
          <button
            onClick={() => {
              addToCart(p, qty)
              setView('cart')
            }}
            className="flex items-center gap-2 rounded-xl gradient-emerald px-6 py-3 font-bold text-sm text-primary-foreground shadow-glow tap-highlight-none hover:scale-105 active:scale-95 transition-transform"
          >
            <Zap className="h-4 w-4" /> {t(language, 'buyNow')}
          </button>
        </div>
      </div>

      {/* Spacer for sticky bar */}
      <div className="h-24" />
    </div>
  )
}
