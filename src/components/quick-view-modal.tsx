'use client'

import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Heart, Plus, Truck, Shield, Check, Sparkles, Eye } from 'lucide-react'
import { toast } from 'sonner'

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist, setSelectedProduct } = useAppStore()

  const product = quickViewProduct
  if (!product) return null

  const isWishlisted = wishlist.includes(product.id)

  const handleAddToCart = () => {
    addToCart(product)
    toast.success(`${product.name} added to cart!`)
    setQuickViewProduct(null)
  }

  const handleViewDetails = () => {
    setSelectedProduct(product)
    setQuickViewProduct(null)
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-2xl rounded-3xl liquid-glass shadow-elevated overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              {/* Close button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full glass-strong tap-highlight-none"
                aria-label="Close quick view"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid sm:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-accent/40 via-muted to-accent/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-60 pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center text-8xl">
                    {product.categoryIcon}
                  </div>
                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {product.discount && (
                      <span className="rounded-full gradient-gold px-2.5 py-0.5 text-[10px] font-bold text-white shadow-glow-gold">
                        −{product.discount}%
                      </span>
                    )}
                    {product.isLocal && (
                      <span className="rounded-full bg-emerald-600/95 px-2 py-0.5 text-[10px] font-bold text-white">
                        🇪🇹 Local
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="truncate">{product.vendor}</span>
                    <Check className="h-3 w-3 text-primary" />
                  </div>

                  <h2 className="text-lg font-black font-display tracking-tight leading-tight text-balance">
                    {product.name}
                  </h2>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 rounded-md bg-amber-500/10 px-2 py-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black tracking-tight">{product.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">ETB</span>
                    </div>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through mb-0.5">
                        {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock status */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {product.inStock ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3 w-3" /> In Stock
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-500/15 px-2 py-0.5 font-bold text-rose-600 dark:text-rose-400">
                        Out of Stock
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Truck className="h-3 w-3" /> {product.deliveryDays} day delivery
                    </span>
                  </div>

                  {/* AI savings */}
                  {product.bundleSavings && (
                    <div className="rounded-xl gradient-emerald p-2.5 text-primary-foreground">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Sparkles className="h-3 w-3" /> Save {product.bundleSavings} Birr with bundle
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl gradient-emerald py-2.5 font-bold text-sm text-primary-foreground shadow-glow tap-highlight-none"
                    >
                      <Plus className="h-4 w-4" /> Add to Cart
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product.id)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl tap-highlight-none transition-colors ${
                        isWishlisted ? 'bg-destructive/10 text-destructive' : 'glass'
                      }`}
                      aria-label="Toggle wishlist"
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-destructive' : ''}`} />
                    </motion.button>
                  </div>

                  {/* View full details */}
                  <button
                    onClick={handleViewDetails}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl glass py-2.5 text-sm font-semibold hover:shadow-premium transition-shadow tap-highlight-none"
                  >
                    <Eye className="h-4 w-4" /> View Full Details
                  </button>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-3 pt-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure</span>
                    <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Fast Delivery</span>
                    <span className="flex items-center gap-1"><Check className="h-3 w-3" /> Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
