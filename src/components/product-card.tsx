'use client'

import { BadgeCheck, Heart, Plus, Star, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { CategoryGlyph } from './category-glyph'

interface ProductCardProps {
  product: Product
  compact?: boolean
  index?: number
}

export function ProductCard({ product, compact = false, index = 0 }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist, setSelectedProduct } = useAppStore()
  const isWishlisted = wishlist.includes(product.id)

  const add = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!product.inStock) return
    addToCart(product)
    toast.success('Added to cart', { description: product.name })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.2) }}
      onClick={() => setSelectedProduct(product)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_18px_40px_-24px_rgba(23,51,38,.35)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f3efe5] dark:bg-muted">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid h-full place-items-center text-primary transition duration-500 group-hover:scale-105" role="img" aria-label={product.category}>
            <CategoryGlyph category={product.category} className="h-16 w-16" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.isLocal && <span className="rounded-full bg-[#0f5132] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white">Made in Ethiopia</span>}
          {product.discount && <span className="rounded-full bg-[#f3c64d] px-2.5 py-1 text-[9px] font-extrabold text-[#173326]">Save {product.discount}%</span>}
        </div>

        <button
          onClick={(event) => { event.stopPropagation(); toggleWishlist(product.id) }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-black/5 bg-white/90 text-[#173326] shadow-sm backdrop-blur"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#c84a34] text-[#c84a34]' : ''}`} />
        </button>
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
          <span className="truncate">{product.vendor}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-extrabold leading-5 tracking-[-0.02em]">{product.name}</h3>

        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
          {product.reviewCount > 0 ? (
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-[#e3a921] text-[#e3a921]" /><strong className="text-foreground">{product.rating.toFixed(1)}</strong> ({product.reviewCount})</span>
          ) : <span>New</span>}
          <span className="ml-auto flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> {product.deliveryDays}–{product.deliveryDays + 1} days</span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-2 border-t border-border/70 pt-3">
          <div>
            <div className="flex items-baseline gap-1"><span className="text-lg font-black tracking-[-0.04em]">{product.price.toLocaleString()}</span><span className="text-[10px] font-bold text-muted-foreground">ETB</span></div>
            {product.originalPrice && <span className="text-[10px] text-muted-foreground line-through">{product.originalPrice.toLocaleString()} ETB</span>}
          </div>
          <button
            onClick={add}
            disabled={!product.inStock}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            aria-label={product.inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
          >
            <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
