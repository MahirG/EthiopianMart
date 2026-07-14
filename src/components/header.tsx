'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { LanguageSelector } from './language-selector'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import {
  Search, Bell, ShoppingCart, Sparkles, Moon, Sun, MapPin, ChevronDown,
  TrendingUp, Clock,
} from 'lucide-react'
import { searchSuggestions, products } from '@/lib/data'

export function Header() {
  const {
    language, view, setView, cartCount, notifOpen, setNotifOpen,
    theme, toggleTheme, wishlist,
  } = useAppStore()

  const count = cartCount()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8)
  })

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Filter suggestions based on query
  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : searchSuggestions.slice(0, 5)

  const matchedProducts = searchQuery
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : []

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar — becomes more compact + stronger glass on scroll */}
      <motion.div
        animate={{
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`border-b border-border/40 transition-shadow duration-300 ${
          scrolled ? 'liquid-glass shadow-sm' : 'glass-strong'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-3 sm:gap-3 sm:px-4">
          {/* Logo */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('home')}
            className="flex items-center gap-2 tap-highlight-none"
            aria-label="Gulit.shop home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-ethiopian text-white shadow-glow">
              <span className="text-base font-black">G</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-black leading-none text-gradient-emerald font-display tracking-tight">Gulit.shop</div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">Shop Smart, Save More</div>
            </div>
          </motion.button>

          {/* Location */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="hidden md:flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1.5 text-sm hover:bg-accent transition-colors tap-highlight-none"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">Deliver to Bole</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </motion.button>

          {/* Search bar with instant suggestions */}
          <div ref={searchRef} className="flex-1 relative">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-all ${
                searchFocused ? 'liquid-glass shadow-glow ring-2 ring-primary/30' : 'glass hover:shadow-premium'
              }`}
            >
              <Search className="h-4 w-4 text-primary shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    setView('search')
                    setSearchFocused(false)
                  }
                }}
                placeholder={t(language, 'searchPlaceholder')}
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-foreground min-w-0"
                aria-label="Search products"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-muted-foreground hover:text-foreground tap-highlight-none shrink-0"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              ) : (
                <kbd className="hidden md:inline-flex items-center gap-1 rounded-md border border-border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium shrink-0">
                  ⌘K
                </kbd>
              )}
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl liquid-glass shadow-elevated overflow-hidden z-50"
                >
                  <div className="max-h-[70vh] overflow-y-auto scrollbar-thin">
                    {/* Matched products */}
                    {matchedProducts.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          Products
                        </div>
                        {matchedProducts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              useAppStore.getState().setSelectedProduct(p)
                              setSearchFocused(false)
                              setSearchQuery('')
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-xl">
                              {p.categoryIcon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">{p.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{p.vendor}</div>
                            </div>
                            <div className="font-bold text-sm shrink-0">{p.price.toLocaleString()} ETB</div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Search suggestions */}
                    <div className="p-2 border-t border-border/30">
                      <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                        {searchQuery ? <Clock className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {searchQuery ? 'Suggestions' : 'Trending Searches'}
                      </div>
                      {filteredSuggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSearchQuery(s)
                            setView('search')
                            setSearchFocused(false)
                          }}
                          className="flex w-full items-center gap-2 rounded-xl p-2 hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                        >
                          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-sm flex-1 truncate">{s}</span>
                          {!searchQuery && <span className="text-[10px] text-muted-foreground">🔥</span>}
                        </button>
                      ))}
                    </div>

                    {/* View all results */}
                    {searchQuery && (
                      <button
                        onClick={() => { setView('search'); setSearchFocused(false) }}
                        className="w-full flex items-center justify-center gap-1 p-3 border-t border-border/30 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors tap-highlight-none"
                      >
                        View all results for &ldquo;{searchQuery}&rdquo;
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full glass hover:shadow-premium transition-all tap-highlight-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </motion.button>

            <LanguageSelector />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full glass hover:shadow-premium transition-all tap-highlight-none"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground"
              >
                3
              </motion.span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setView('cart')}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all tap-highlight-none ${
                view === 'cart' ? 'gradient-emerald text-primary-foreground shadow-glow' : 'glass hover:shadow-premium'
              }`}
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full gradient-gold px-1 text-[10px] font-bold text-white shadow-glow-gold"
                >
                  {count}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* AI assistant floating entry bar (only on home/search) */}
      {(view === 'home' || view === 'search') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-7xl px-3 sm:px-4 pt-3"
        >
          <motion.button
            whileTap={{ scale: 0.99 }}
            whileHover={{ y: -1 }}
            onClick={() => useAppStore.getState().setAiOpen(true)}
            className="group flex w-full items-center gap-3 rounded-2xl glass px-4 py-2.5 shadow-premium hover:shadow-glow transition-all tap-highlight-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-emerald text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="flex-1 text-left text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Ask AI:</span> Find me the cheapest Samsung phone under 25,000 Birr
            </span>
            <span className="hidden sm:flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> AI Assistant
            </span>
          </motion.button>
        </motion.div>
      )}
    </header>
  )
}
