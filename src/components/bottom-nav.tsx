'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { motion } from 'framer-motion'
import { Home, Search, ShoppingBag, Sparkles, User } from 'lucide-react'
import type { View } from '@/lib/types'

const navItems: { view: View; icon: typeof Home; labelKey: 'home' | 'search' | 'cart' | 'assistant' | 'profile' }[] = [
  { view: 'home', icon: Home, labelKey: 'home' },
  { view: 'search', icon: Search, labelKey: 'search' },
  { view: 'cart', icon: ShoppingBag, labelKey: 'cart' },
  { view: 'ai', icon: Sparkles, labelKey: 'assistant' },
  { view: 'profile', icon: User, labelKey: 'profile' },
]

export function BottomNav() {
  const { view, setView, language, cartCount } = useAppStore()
  const count = cartCount()

  return (
    <>
      {/* Desktop sidebar nav */}
      <nav className="hidden lg:flex fixed left-0 top-0 z-30 h-full w-20 flex-col items-center gap-2 border-r border-border/40 glass py-6">
        <button
          onClick={() => setView('home')}
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl gradient-ethiopian text-white shadow-glow"
          aria-label="Gebeya home"
        >
          <span className="text-xl font-black">G</span>
        </button>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = view === item.view
          return (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`relative flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl transition-all tap-highlight-none ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={t(language, item.labelKey)}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-2xl bg-primary/10"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.view === 'cart' && count > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full gradient-gold px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{t(language, item.labelKey)}</span>
            </button>
          )
        })}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="glass-strong border-t border-border/40 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = view === item.view
              return (
                <button
                  key={item.view}
                  onClick={() => setView(item.view)}
                  className={`relative flex flex-col items-center gap-1 px-3 py-1.5 transition-colors tap-highlight-none ${
                    active ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  aria-label={t(language, item.labelKey)}
                >
                  <div className="relative">
                    {active ? (
                      <motion.div
                        layoutId="mobile-nav-active"
                        className="absolute -inset-2 rounded-2xl bg-primary/10"
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      />
                    ) : null}
                    <Icon className="relative h-5 w-5" />
                    {item.view === 'cart' && count > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full gradient-gold px-1 text-[9px] font-bold text-white">
                        {count}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{t(language, item.labelKey)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
