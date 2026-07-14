'use client'

import { useAppStore } from '@/lib/store'
import type { Product } from '@/lib/types'
import { motion } from 'framer-motion'
import { Heart, Star, MapPin, Plus, Truck, Sparkles, TrendingDown } from 'lucide-react'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  compact?: boolean
  index?: number
}

export function ProductCard({ product, compact = false, index = 0 }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist, setSelectedProduct } = useAppStore()
  const isWishlisted = wishlist.includes(product.id)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    toast.success(`${product.name} added to cart`, {
      description: `Save ${product.bundleSavings || 0} Birr with smart bundle`,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -4 }}
      onClick={() => setSelectedProduct(product)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl glass shadow-premium transition-all hover:shadow-glow"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-accent/50 to-muted">
        <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
          {product.categoryIcon}
        </div>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.discount && (
            <span className="rounded-full gradient-gold px-2 py-0.5 text-[10px] font-bold text-white shadow-glow-gold">
              -{product.discount}%
            </span>
          )}
          {product.isLocal && (
            <span className="rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              🇪🇹 Local
            </span>
          )}
          {product.isHandmade && (
            <span className="rounded-full bg-amber-700/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
              ✋ Handmade
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist(product.id)
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full glass-strong tap-highlight-none"
          aria-label="Add to wishlist"
        >
          <Heart className={`h-4 w-4 transition-all ${isWishlisted ? 'fill-destructive text-destructive' : 'text-foreground'}`} />
        </button>

        {/* AI savings tip */}
        {product.bundleSavings && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex items-center gap-1.5 rounded-lg glass-strong px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3 w-3 shrink-0" />
              <span className="truncate">Save {product.bundleSavings} Birr</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-3 ${compact ? 'space-y-1' : 'space-y-2'}`}>
        {/* Vendor */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="h-2.5 w-2.5" />
          <span className="truncate">{product.vendor}</span>
        </div>

        {/* Name */}
        <h3 className={`font-semibold leading-tight line-clamp-2 ${compact ? 'text-xs' : 'text-sm'}`}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 rounded-md bg-amber-500/10 px-1.5 py-0.5">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{product.rating}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
          {product.deliveryDays <= 2 && (
            <span className="ml-auto flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <Truck className="h-3 w-3" />
              {product.deliveryDays}d
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-black text-foreground">{product.price.toLocaleString()}</span>
              <span className="text-[10px] font-medium text-muted-foreground">ETB</span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through">
                {product.originalPrice.toLocaleString()} ETB
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl gradient-emerald text-primary-foreground shadow-glow tap-highlight-none hover:scale-105 active:scale-95 transition-transform"
            aria-label="Add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* AI prediction */}
        {product.bestTimeToBuy && !compact && (
          <div className="flex items-center gap-1 rounded-lg bg-primary/5 px-2 py-1 text-[10px] text-primary">
            <TrendingDown className="h-3 w-3" />
            <span>Best to buy on {product.bestTimeToBuy}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
