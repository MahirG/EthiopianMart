import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, View, CartItem, Product } from './types'

const coupons = [
  { code: 'WELCOME10', discount: 10, type: 'percent' as const, minOrder: 500 },
  { code: 'COFFEE23', discount: 23, type: 'percent' as const, minOrder: 1000 },
  { code: 'FRIDAY18', discount: 18, type: 'percent' as const, minOrder: 1500 },
  { code: 'ETHIOMART500', discount: 500, type: 'fixed' as const, minOrder: 5000 },
]

interface AppState {
  // Navigation
  view: View
  setView: (v: View) => void
  selectedProduct: Product | null
  setSelectedProduct: (p: Product | null) => void
  catalogQuery: string
  setCatalogQuery: (query: string) => void
  catalogCategory: string
  setCatalogCategory: (category: string) => void
  catalogLocal: boolean
  setCatalogLocal: (local: boolean) => void
  catalogSort: string
  setCatalogSort: (sort: string) => void

  // Recently viewed
  recentlyViewed: string[]
  addRecentlyViewed: (id: string) => void

  // Theme & Language
  theme: 'light' | 'dark'
  toggleTheme: () => void
  language: Language
  setLanguage: (l: Language) => void

  // Cart
  cart: CartItem[]
  addToCart: (p: Product, qty?: number) => void
  removeFromCart: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  cartCount: () => number
  cartTotal: () => number

  // Coupon
  appliedCoupon: { code: string; discount: number; type: 'percent' | 'fixed' } | null
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void

  // Wishlist
  wishlist: string[]
  toggleWishlist: (id: string) => void

  // Notifications
  notifOpen: boolean
  setNotifOpen: (v: boolean) => void

  // Auth modal
  authModalOpen: boolean
  authMode: 'login' | 'register'
  openAuth: (mode?: 'login' | 'register') => void
  closeAuth: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'home',
      setView: (v) => set({ view: v }),
      catalogQuery: '',
      setCatalogQuery: (catalogQuery) => set({ catalogQuery, view: 'search' }),
      catalogCategory: 'all',
      setCatalogCategory: (catalogCategory) => set({ catalogCategory, view: 'search' }),
      catalogLocal: false,
      setCatalogLocal: (catalogLocal) => set({ catalogLocal, view: 'search' }),
      catalogSort: 'relevance',
      setCatalogSort: (catalogSort) => set({ catalogSort }),
      selectedProduct: null,
      setSelectedProduct: (p) => {
        set({ selectedProduct: p, view: p ? 'product' : get().view })
        if (p) {
          // Track recently viewed
          const current = get().recentlyViewed.filter((id) => id !== p.id)
          set({ recentlyViewed: [p.id, ...current].slice(0, 8) })
        }
      },

      recentlyViewed: [],
      addRecentlyViewed: (id) =>
        set((s) => {
          const filtered = s.recentlyViewed.filter((r) => r !== id)
          return { recentlyViewed: [id, ...filtered].slice(0, 8) }
        }),

      theme: 'light',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      language: 'en',
      setLanguage: (l) => set({ language: l }),

      cart: [],
      addToCart: (p, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((i) => i.product.id === p.id)
          if (existing) {
            return {
              cart: s.cart.map((i) =>
                i.product.id === p.id ? { ...i, quantity: i.quantity + qty } : i
              ),
            }
          }
          return { cart: [...s.cart, { product: p, quantity: qty }] }
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.product.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          cart: qty <= 0
            ? s.cart.filter((i) => i.product.id !== id)
            : s.cart.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)),
        })),
      clearCart: () => set({ cart: [], appliedCoupon: null }),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      appliedCoupon: null,
      applyCoupon: (code) => {
        const coupon = coupons.find((c) => c.code === code.toUpperCase())
        if (!coupon) return false
        const total = get().cartTotal()
        if (total < coupon.minOrder) return false
        set({ appliedCoupon: { code: coupon.code, discount: coupon.discount, type: coupon.type } })
        return true
      },
      removeCoupon: () => set({ appliedCoupon: null }),

      wishlist: [],
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),

      notifOpen: false,
      setNotifOpen: (v) => set({ notifOpen: v }),

      authModalOpen: false,
      authMode: 'login',
      openAuth: (mode = 'login') => set({ authModalOpen: true, authMode: mode }),
      closeAuth: () => set({ authModalOpen: false }),
    }),
    {
      name: 'ethiopian-mart-store',
      partialize: (s) => ({
        theme: s.theme, language: s.language, cart: s.cart,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
      }),
    }
  )
)
