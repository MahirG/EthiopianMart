'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { products, categories } from '@/lib/data'
import { ProductCard } from './product-card'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Mic, Camera, ScanLine, X, SlidersHorizontal, TrendingUp,
  Clock, ChevronDown,
} from 'lucide-react'

const recentSearches = ['Yirgacheffe coffee', 'Samsung phone', 'Berbere spice', 'Teff flour', 'Habesha kemis']
const trendingSearches = ['Coffee', 'Phones under 25k', 'Cooking oil', 'Injera mitad', 'Leather bags']

type SearchMode = 'text' | 'voice' | 'image' | 'barcode'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export function SearchView() {
  const { language } = useAppStore()
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<SearchMode>('text')
  const [isListening, setIsListening] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating' | 'discount'>('relevance')

  const filtered = products.filter((p) => {
    const matchQuery = !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.vendor.toLowerCase().includes(query.toLowerCase()) ||
      p.category.includes(query.toLowerCase())
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory
    return matchQuery && matchCat
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_low': return a.price - b.price
      case 'price_high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      case 'discount': return (b.discount || 0) - (a.discount || 0)
      default: return 0
    }
  })

  const startVoiceSearch = () => {
    setIsListening(true)
    setMode('voice')
    setTimeout(() => {
      setIsListening(false)
      setQuery('Samsung phone under 25000 birr')
      setMode('text')
    }, 2500)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Search modes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-4 gap-2"
      >
        {[
          { id: 'text' as SearchMode, icon: Search, label: t(language, 'search'), color: 'gradient-emerald' },
          { id: 'voice' as SearchMode, icon: Mic, label: t(language, 'voiceSearch'), color: 'gradient-gold' },
          { id: 'image' as SearchMode, icon: Camera, label: t(language, 'imageSearch'), color: 'from-rose-500 to-pink-600' },
          { id: 'barcode' as SearchMode, icon: ScanLine, label: t(language, 'barcodeSearch'), color: 'from-violet-500 to-purple-600' },
        ].map((m) => {
          const Icon = m.icon
          const active = mode === m.id
          return (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.94 }}
              whileHover={{ y: -2 }}
              onClick={() => {
                setMode(m.id)
                if (m.id === 'voice') startVoiceSearch()
              }}
              className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all tap-highlight-none ${
                active ? `bg-gradient-to-br ${m.color} text-white shadow-glow` : 'glass text-foreground hover:shadow-premium'
              }`}
              aria-label={m.label}
              aria-pressed={active}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{m.label}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Search input */}
      <div className="relative">
        <div className="flex items-center gap-2 rounded-2xl liquid-glass px-4 py-3 shadow-premium">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(language, 'searchPlaceholder')}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
            aria-label="Search products"
          />
          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setQuery('')}
              className="rounded-full p-1 hover:bg-accent tap-highlight-none"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          )}
          <button
            onClick={() => setShowFilters((f) => !f)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors tap-highlight-none ${
              showFilters ? 'bg-primary text-primary-foreground shadow-glow' : 'hover:bg-accent'
            }`}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Voice listening overlay */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute inset-x-0 top-full mt-2 z-20"
            >
              <div className="rounded-2xl gradient-gold p-6 text-center text-white shadow-glow-gold">
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <Mic className="h-10 w-10" />
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-white/50"
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                      />
                    ))}
                  </div>
                </div>
                <div className="font-bold">Listening...</div>
                <div className="text-sm text-white/85 mt-1">Speak in Amharic, Oromo, or English</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl glass p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors tap-highlight-none ${
                      selectedCategory === 'all' ? 'gradient-emerald text-primary-foreground shadow-glow' : 'bg-accent hover:bg-accent/70'
                    }`}
                  >
                    All
                  </button>
                  {categories.slice(0, 8).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1 tap-highlight-none ${
                        selectedCategory === c.id ? 'gradient-emerald text-primary-foreground shadow-glow' : 'bg-accent hover:bg-accent/70'
                      }`}
                    >
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sort by</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { id: 'relevance', label: 'Relevance' },
                    { id: 'price_low', label: 'Price: Low to High' },
                    { id: 'price_high', label: 'Price: High to Low' },
                    { id: 'rating', label: 'Top Rated' },
                    { id: 'discount', label: 'Biggest Discount' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSortBy(s.id as typeof sortBy)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors tap-highlight-none ${
                        sortBy === s.id ? 'gradient-emerald text-primary-foreground shadow-glow' : 'bg-accent hover:bg-accent/70'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent & Trending searches */}
      {!query && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 gap-4"
        >
          <motion.div variants={itemVariants} className="rounded-2xl glass p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-bold">Recent Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full bg-accent hover:bg-accent/70 px-3 py-1 text-xs font-medium transition-colors tap-highlight-none"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="rounded-2xl glass p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold">Trending Now</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full bg-primary/10 hover:bg-primary/20 px-3 py-1 text-xs font-medium text-primary transition-colors tap-highlight-none"
                >
                  🔥 {s}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Results */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filtered.length}</span> results for &ldquo;{query}&rdquo;
            </p>
          </div>
          {filtered.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {filtered.map((p, i) => (
                <motion.div key={p.id} variants={itemVariants}>
                  <ProductCard product={p} index={i} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl glass p-12 text-center"
            >
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-bold mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground">Try a different search term or use voice/image search</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Browse by category when no query */}
      {!query && (
        <div>
          <h2 className="text-lg font-black mb-3 font-display tracking-tight">Browse Categories</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {categories.map((c) => (
              <motion.button
                key={c.id}
                variants={itemVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedCategory(c.id)
                  setQuery(c.name)
                }}
                className="flex items-center gap-3 rounded-2xl glass p-3 hover:shadow-premium transition-shadow tap-highlight-none"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-2xl shadow-sm`}>
                  {c.icon}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.productCount.toLocaleString()} items</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}
