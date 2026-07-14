import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, View, CartItem, Product, ChatMessage } from './types'
import { aiQuickPrompts } from './data'

interface AppState {
  // Navigation
  view: View
  setView: (v: View) => void
  selectedProduct: Product | null
  setSelectedProduct: (p: Product | null) => void

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

  // Wishlist
  wishlist: string[]
  toggleWishlist: (id: string) => void

  // AI Assistant
  aiOpen: boolean
  setAiOpen: (v: boolean) => void
  chatMessages: ChatMessage[]
  sendMessage: (content: string) => void

  // Notifications
  notifOpen: boolean
  setNotifOpen: (v: boolean) => void

  // Toast / saved
  savedTotal: number
  addSavings: (amt: number) => void
}

const initialAssistantMessage: ChatMessage = {
  id: 'm0', role: 'assistant',
  content: 'Selam! 👋 I\'m your AI shopping assistant. I can help you find the best deals, compare products, plan your budget, and save money. Try asking me anything — in Amharic, Oromo, English, or any language you prefer!',
  timestamp: new Date().toISOString(),
  suggestions: aiQuickPrompts.slice(0, 4),
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: 'home',
      setView: (v) => set({ view: v }),
      selectedProduct: null,
      setSelectedProduct: (p) => set({ selectedProduct: p, view: p ? 'product' : get().view }),

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
      clearCart: () => set({ cart: [] }),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      wishlist: ['p1', 'p4'],
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((w) => w !== id)
            : [...s.wishlist, id],
        })),

      aiOpen: false,
      setAiOpen: (v) => set({ aiOpen: v }),
      chatMessages: [initialAssistantMessage],
      sendMessage: (content) => {
        const userMsg: ChatMessage = {
          id: `m${Date.now()}`, role: 'user', content, timestamp: new Date().toISOString(),
        }
        set((s) => ({ chatMessages: [...s.chatMessages, userMsg] }))

        // Simulated AI response
        setTimeout(() => {
          const responses = generateAIResponse(content)
          const aiMsg: ChatMessage = {
            id: `m${Date.now() + 1}`, role: 'assistant',
            content: responses.content, timestamp: new Date().toISOString(),
            suggestions: responses.suggestions,
          }
          set((s) => ({ chatMessages: [...s.chatMessages, aiMsg] }))
        }, 900)
      },

      notifOpen: false,
      setNotifOpen: (v) => set({ notifOpen: v }),

      savedTotal: 8450,
      addSavings: (amt) => set((s) => ({ savedTotal: s.savedTotal + amt })),
    }),
    {
      name: 'gebeya-store',
      partialize: (s) => ({
        theme: s.theme, language: s.language, cart: s.cart,
        wishlist: s.wishlist, savedTotal: s.savedTotal,
      }),
    }
  )
)

function generateAIResponse(input: string): { content: string; suggestions: string[] } {
  const lower = input.toLowerCase()
  if (lower.includes('phone') || lower.includes('samsung') || lower.includes('mobile')) {
    return {
      content: 'I found the Samsung Galaxy A15 (128GB) for 18,900 Birr — down from 22,500! 📱 It\'s the cheapest Samsung phone under 25,000 Birr with a 50MP camera and 5000mAh battery. Best time to buy is Friday for an extra 8% off. Want me to add it to your cart?',
      suggestions: ['Add to cart', 'Compare with similar phones', 'Show me other options'],
    }
  }
  if (lower.includes('cooking oil') || lower.includes('oil')) {
    return {
      content: 'Great question! 🛢️ Based on price-per-liter and quality, the Olive Cooking Oil 5L at 1,850 Birr saves you 550 Birr vs. the 2,400 Birr average. Wait until Friday — I predict an additional 12% drop. Bundle with teff flour for 150 Birr extra savings!',
      suggestions: ['Show bundle deal', 'Compare all oils', 'Set price alert'],
    }
  }
  if (lower.includes('grocer') || lower.includes('family') || lower.includes('food')) {
    return {
      content: 'For a family of six, I recommend: 10kg Teff flour (960 Birr), 5L cooking oil (1,850 Birr), Berbere spice (320 Birr), 2kg coffee (1,700 Birr), fresh vegetables (~800 Birr). Total: ~5,630 Birr. You\'ll save 830 Birr vs. buying separately! 🛒',
      suggestions: ['Add all to cart', 'Customize list', 'Find cheaper alternatives'],
    }
  }
  if (lower.includes('local') || lower.includes('ethiopian') || lower.includes('made')) {
    return {
      content: 'Ethiopia has amazing local products! 🇪🇹 Top picks: Yirgacheffe Coffee (850 Birr), Habesha Kemis (4,500 Birr), Berbere spice (320 Birr), Teff flour (480 Birr), and hand-crafted leather bags (2,800 Birr). All support local artisans and farmers!',
      suggestions: ['Show all local products', 'Find nearby artisans', 'Learn about vendors'],
    }
  }
  if (lower.includes('compare') || lower.includes('alternatives')) {
    return {
      content: 'I can compare products by price, quality, features, and reviews! 📊 For example, the JBL Flip 6 (6,800 Birr) vs. similar speakers: better battery life, superior sound, and 20% off. Would you like a detailed comparison table?',
      suggestions: ['Yes, show comparison', 'Compare coffee brands', 'Compare phones'],
    }
  }
  if (lower.includes('budget') || lower.includes('spend') || lower.includes('save')) {
    return {
      content: '💰 This month you\'ve saved 8,450 Birr using smart bundles and price alerts! Your top savings: Coffee bundle (530 Birr), phone purchase (3,600 Birr), and grocery bundle (830 Birr). Set a monthly budget and I\'ll help you stick to it!',
      suggestions: ['Set monthly budget', 'View savings history', 'Find more deals'],
    }
  }
  return {
    content: 'I\'m here to help you shop smart and save money! 🛍️ I can find products, compare prices, suggest bundles, track your budget, recommend local Ethiopian products, and alert you to price drops. What would you like to explore?',
    suggestions: aiQuickPrompts.slice(0, 4),
  }
}
