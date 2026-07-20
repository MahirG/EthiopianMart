'use client'

import { Home, Search, ShoppingBag, PackageCheck, User } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { View } from '@/lib/types'

const items: { view: View; icon: typeof Home; label: string }[] = [
  { view: 'home', icon: Home, label: 'Home' },
  { view: 'search', icon: Search, label: 'Shop' },
  { view: 'cart', icon: ShoppingBag, label: 'Cart' },
  { view: 'orders', icon: PackageCheck, label: 'Orders' },
  { view: 'profile', icon: User, label: 'Account' },
]

export function BottomNav() {
  const { view, setView, cartCount } = useAppStore()
  const count = cartCount()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {items.map(({ view: itemView, icon: Icon, label }) => {
          const active = view === itemView
          return (
            <button
              key={itemView}
              onClick={() => setView(itemView)}
              className={`relative flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              {label}
              {itemView === 'cart' && count > 0 && (
                <span className="absolute right-2 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#c84a34] px-1 text-[9px] text-white">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
