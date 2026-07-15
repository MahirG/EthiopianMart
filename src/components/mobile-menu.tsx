'use client'

import { useAppStore } from '@/lib/store'
import { categories } from '@/lib/data'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Home, Store, Tag, Zap, Sparkles, Award, Truck, Headphones,
  Info, Mail, Heart, ChevronDown, ChevronRight, User, Moon, Sun,
  Globe, Flame, ShoppingBag, Search as SearchIcon,
} from 'lucide-react'
import { useState } from 'react'
import { LanguageSelector } from './language-selector'
import type { View } from '@/lib/types'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

const menuSections: {
  title: string
  items: { label: string; view?: View; action?: string; icon: typeof Home }[]
}[] = [
  {
    title: 'Shop',
    items: [
      { label: 'Home', view: 'home', icon: Home },
      { label: 'All Products', view: 'search', icon: Store },
      { label: 'Today\'s Deals', view: 'search', action: 'deals', icon: Flame },
      { label: 'Flash Sale', view: 'search', action: 'flash', icon: Zap },
      { label: 'New Arrivals', view: 'search', action: 'new', icon: Sparkles },
      { label: 'Best Sellers', view: 'search', action: 'best', icon: Award },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Track Order', view: 'orders', icon: Truck },
      { label: 'Wishlist', view: 'profile', action: 'wishlist', icon: Heart },
      { label: 'My Cart', view: 'cart', icon: ShoppingBag },
    ],
  },
  {
    title: 'Help',
    items: [
      { label: 'Support', action: 'support', icon: Headphones },
      { label: 'About Us', action: 'about', icon: Info },
      { label: 'Contact', action: 'contact', icon: Mail },
    ],
  },
]

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { setView, theme, toggleTheme, openAuth, cartCount, wishlist } = useAppStore()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const count = cartCount()

  const handleItemClick = (item: { view?: View; action?: string }) => {
    if (item.view) {
      setView(item.view)
      onClose()
    } else if (item.action === 'support' || item.action === 'about' || item.action === 'contact') {
      onClose()
      setTimeout(() => {
        document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else if (item.action === 'wishlist') {
      onClose()
      setTimeout(() => {
        document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleCategoryClick = () => {
    setView('search')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 z-[70] h-full w-[85%] max-w-sm flex flex-col glass-strong shadow-elevated lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 gradient-emerald text-primary-foreground">
              <button
                onClick={() => { setView('home'); onClose() }}
                className="flex items-center gap-2 tap-highlight-none"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                  <span className="font-black font-display">G</span>
                </div>
                <span className="font-black text-lg font-display tracking-tight">Gulit.shop</span>
              </button>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors tap-highlight-none"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
              {/* Auth button */}
              <button
                onClick={() => { openAuth('login'); onClose() }}
                className="w-full flex items-center justify-center gap-2 rounded-xl gradient-emerald py-3 font-bold text-sm text-primary-foreground shadow-glow tap-highlight-none"
              >
                <User className="h-4 w-4" /> Sign In / Register
              </button>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setView('cart'); onClose() }}
                  className="flex items-center justify-between rounded-xl glass p-3 tap-highlight-none"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Cart</span>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{count}</span>
                </button>
                <button
                  onClick={() => { setView('profile'); onClose() }}
                  className="flex items-center justify-between rounded-xl glass p-3 tap-highlight-none"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-semibold">Wishlist</span>
                  </div>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">{wishlist.length}</span>
                </button>
              </div>

              {/* Categories accordion */}
              <div>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full flex items-center justify-between rounded-xl glass p-3 tap-highlight-none"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">Categories</span>
                  </div>
                  <motion.div animate={{ rotate: categoriesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={handleCategoryClick}
                            className="flex items-center gap-2 rounded-xl glass p-2.5 hover:shadow-premium transition-shadow tap-highlight-none"
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${cat.color} text-base`}>
                              {cat.icon}
                            </div>
                            <span className="text-xs font-semibold truncate">{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Menu sections */}
              {menuSections.map((section, sIdx) => (
                <div key={sIdx}>
                  <h3 className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-2 px-1">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={idx}
                          onClick={() => handleItemClick(item)}
                          className="w-full flex items-center gap-3 rounded-xl glass p-3 hover:bg-accent/50 transition-colors tap-highlight-none group"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="flex-1 text-left font-semibold text-sm group-hover:text-primary transition-colors">{item.label}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Settings */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-2 px-1">
                  Settings
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 rounded-xl glass p-3 hover:bg-accent/50 transition-colors tap-highlight-none"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                      {theme === 'light' ? <Moon className="h-4 w-4 text-violet-600 dark:text-violet-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
                    </div>
                    <span className="flex-1 text-left font-semibold text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                  <div className="flex items-center gap-3 rounded-xl glass p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                      <Globe className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="flex-1 font-semibold text-sm">Language</span>
                    <LanguageSelector />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/40 text-center">
              <p className="text-xs text-muted-foreground">
                © 2026 Gulit.shop • Powered by{' '}
                <a
                  href="https://hisabtechnologies.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  HisabTech
                </a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
