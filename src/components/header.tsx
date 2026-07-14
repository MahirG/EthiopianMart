'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { LanguageSelector } from './language-selector'
import { motion } from 'framer-motion'
import {
  Search, Bell, ShoppingCart, Sparkles, Moon, Sun, MapPin, ChevronDown,
} from 'lucide-react'

export function Header() {
  const {
    language, view, setView, cartCount, notifOpen, setNotifOpen,
    theme, toggleTheme, wishlist,
  } = useAppStore()

  const count = cartCount()

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top bar */}
      <div className="glass-strong border-b border-border/40">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {/* Logo */}
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 tap-highlight-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-ethiopian text-white shadow-glow">
              <span className="text-lg font-black">G</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-black leading-none text-gradient-emerald">Gebeya</div>
              <div className="text-[10px] text-muted-foreground leading-none mt-0.5">Ethiopia's Super App</div>
            </div>
          </button>

          {/* Location */}
          <button className="hidden md:flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1.5 text-sm hover:bg-accent transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">Deliver to Bole</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          {/* Search bar */}
          <button
            onClick={() => setView('search')}
            className="flex flex-1 items-center gap-2 rounded-full glass px-4 py-2.5 text-sm text-muted-foreground hover:shadow-premium transition-all tap-highlight-none"
          >
            <Search className="h-4 w-4 text-primary" />
            <span className="flex-1 text-left truncate">{t(language, 'searchPlaceholder')}</span>
            <kbd className="hidden md:inline-flex items-center gap-1 rounded-md border border-border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium">
              ⌘K
            </kbd>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full glass hover:shadow-premium transition-all tap-highlight-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <LanguageSelector />

            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full glass hover:shadow-premium transition-all tap-highlight-none"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                3
              </span>
            </button>

            <button
              onClick={() => setView('cart')}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all tap-highlight-none ${
                view === 'cart' ? 'gradient-emerald text-primary-foreground shadow-glow' : 'glass hover:shadow-premium'
              }`}
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full gradient-gold px-1 text-[10px] font-bold text-white shadow-glow-gold"
                >
                  {count}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI assistant floating entry bar (only on home/search) */}
      {(view === 'home' || view === 'search') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-7xl px-4 pt-3"
        >
          <button
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
          </button>
        </motion.div>
      )}
    </header>
  )
}
