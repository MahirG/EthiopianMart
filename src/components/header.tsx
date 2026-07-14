'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { LanguageSelector } from './language-selector'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import {
  Search, Bell, ShoppingCart, Sparkles, Moon, Sun, MapPin, ChevronDown,
} from 'lucide-react'

export function Header() {
  const {
    language, view, setView, cartCount, notifOpen, setNotifOpen,
    theme, toggleTheme, wishlist,
  } = useAppStore()

  const count = cartCount()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8)
  })

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
            aria-label="Gebeya home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-ethiopian text-white shadow-glow">
              <span className="text-base font-black">G</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-black leading-none text-gradient-emerald font-display tracking-tight">Gebeya</div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">Ethiopia's Super App</div>
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

          {/* Search bar */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('search')}
            className="flex flex-1 items-center gap-2 rounded-full glass px-4 py-2.5 text-sm text-muted-foreground hover:shadow-premium transition-all tap-highlight-none group"
          >
            <Search className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
            <span className="flex-1 text-left truncate">{t(language, 'searchPlaceholder')}</span>
            <kbd className="hidden md:inline-flex items-center gap-1 rounded-md border border-border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium">
              ⌘K
            </kbd>
          </motion.button>

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
