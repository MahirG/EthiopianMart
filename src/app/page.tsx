'use client'

import { useAppStore } from '@/lib/store'
import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { NotificationsPanel } from '@/components/notifications-panel'
import { AIAssistant } from '@/components/ai-assistant'
import { FloatingAIButton } from '@/components/floating-ai-button'
import { HomeView } from '@/components/home-view'
import { SearchView } from '@/components/search-view'
import { CartView } from '@/components/cart-view'
import { OrdersView } from '@/components/orders-view'
import { WalletView } from '@/components/wallet-view'
import { ProfileView } from '@/components/profile-view'
import { VendorView } from '@/components/vendor-view'
import { AdminView } from '@/components/admin-view'
import { ProductDetailView } from '@/components/product-detail-view'
import { AIAssistantView } from '@/components/ai-assistant-view'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const { view } = useAppStore()

  const renderView = () => {
    switch (view) {
      case 'home': return <HomeView />
      case 'search': return <SearchView />
      case 'cart': return <CartView />
      case 'orders': return <OrdersView />
      case 'wallet': return <WalletView />
      case 'profile': return <ProfileView />
      case 'vendor': return <VendorView />
      case 'admin': return <AdminView />
      case 'product': return <ProductDetailView />
      case 'ai': return <AIAssistantView />
      default: return <HomeView />
    }
  }

  return (
    <div className="min-h-screen flex flex-col gradient-mesh">
      <Header />
      <main
        id="main-content"
        className="flex-1 w-full mx-auto max-w-7xl px-3 sm:px-4 py-6 lg:pl-24 lg:pr-8 pb-24 lg:pb-8 scroll-smooth-touch"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
      <FloatingAIButton />
      <NotificationsPanel />
      <AIAssistant />
    </div>
  )
}
