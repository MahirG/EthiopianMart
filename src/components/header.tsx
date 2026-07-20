'use client'

import { FormEvent, useState } from 'react'
import { ChevronDown, MapPin, Menu, Moon, Search, ShoppingBag, Store, Sun, User, X } from 'lucide-react'
import { BrandMark } from './brand-mark'
import { LanguageSelector } from './language-selector'
import { useAppStore } from '@/lib/store'

export function Header() {
  const {
    view, setView, cartCount, theme, toggleTheme,
    catalogQuery, setCatalogQuery, setCatalogCategory, setCatalogLocal,
  } = useAppStore()
  const [query, setQuery] = useState(catalogQuery)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = cartCount()

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    setCatalogQuery(query.trim())
    setMenuOpen(false)
  }

  const go = (target: 'home' | 'search' | 'orders' | 'vendor' | 'profile') => {
    if (target === 'search') {
      setCatalogCategory('all')
      setCatalogLocal(false)
    } else {
      setView(target)
    }
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/75 bg-background/94 backdrop-blur-xl">
      <div className="border-b border-border/60 bg-[#0f5132] text-white">
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-between px-4 text-[10px] font-semibold tracking-wide sm:px-6 lg:px-8">
          <span className="flex items-center gap-1.5"><span className="text-[#f3c64d]">●</span> Verified Ethiopian sellers</span>
          <span className="hidden sm:block">Secure checkout · Local support · Nationwide delivery</span>
          <span lang="am" className="font-ethiopic sm:hidden">ከኢትዮጵያ፣ ለኢትዮጵያ</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3 lg:h-[72px]">
          <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>

          <button onClick={() => go('home')} aria-label="EthiopianMart home" className="shrink-0 text-left">
            <BrandMark compact={false} className="hidden sm:inline-flex" />
            <BrandMark compact className="sm:hidden" />
          </button>

          <button className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold xl:flex">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Addis Ababa <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          <form onSubmit={submitSearch} className="hidden flex-1 md:block">
            <div className="mx-auto flex max-w-2xl items-center rounded-full border border-border bg-muted/40 p-1 transition focus-within:border-primary/50 focus-within:bg-background focus-within:ring-4 focus-within:ring-primary/10">
              <Search className="ml-3 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search coffee, fashion, electronics…"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                aria-label="Search products"
              />
              <button type="submit" className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground">Search</button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden xl:block"><LanguageSelector /></div>
            <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted" aria-label="Toggle color theme">
              {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </button>
            <button onClick={() => go('profile')} className={`hidden h-10 items-center gap-2 rounded-full px-3 text-xs font-bold sm:flex ${view === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>
              <User className="h-[18px] w-[18px]" /> Account
            </button>
            <button onClick={() => setView('cart')} className={`relative grid h-10 w-10 place-items-center rounded-full ${view === 'cart' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`} aria-label="Open cart">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#c84a34] px-1 text-[9px] font-bold text-white">{count}</span>}
            </button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="pb-3 md:hidden">
          <div className="flex items-center rounded-full border border-border bg-muted/40 px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search EthiopianMart" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none" />
          </div>
        </form>

        <nav className="hidden h-11 items-center justify-between border-t border-border/60 lg:flex" aria-label="Main navigation">
          <div className="flex items-center gap-7 text-xs font-semibold">
            <button onClick={() => go('home')} className={view === 'home' ? 'text-primary' : 'hover:text-primary'}>Home</button>
            <button onClick={() => go('search')} className={view === 'search' ? 'text-primary' : 'hover:text-primary'}>Shop all</button>
            <button onClick={() => { setCatalogCategory('all'); setCatalogQuery(''); setCatalogLocal(true); }} className="hover:text-primary">Made in Ethiopia</button>
            <button onClick={() => go('orders')} className={view === 'orders' ? 'text-primary' : 'hover:text-primary'}>Track order</button>
          </div>
          <button onClick={() => go('vendor')} className="flex items-center gap-2 text-xs font-bold text-primary"><Store className="h-4 w-4" /> Seller portal</button>
        </nav>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button className="absolute inset-0 bg-black/45" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="relative h-full w-[84%] max-w-sm bg-background p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <BrandMark />
              <button onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-8 grid gap-2 text-left">
              {[
                ['home', 'Home'], ['search', 'Shop all'], ['orders', 'Track order'], ['vendor', 'Seller portal'], ['profile', 'My account'],
              ].map(([target, label]) => (
                <button key={target} onClick={() => go(target as 'home' | 'search' | 'orders' | 'vendor' | 'profile')} className="rounded-xl px-4 py-3 text-left text-base font-bold hover:bg-muted">{label}</button>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              <LanguageSelector />
              <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-full bg-muted">{theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
