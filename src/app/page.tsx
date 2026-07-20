'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/header'
import { BottomNav } from '@/components/bottom-nav'
import { Footer } from '@/components/footer'
import { AuthModal } from '@/components/auth-modal'
import { HomeView } from '@/components/home-view'
import { SearchView } from '@/components/search-view'
import { CartView } from '@/components/cart-view'
import { OrdersView } from '@/components/orders-view'
import { ProfileView } from '@/components/profile-view'
import { VendorView } from '@/components/vendor-view'
import { AdminView } from '@/components/admin-view'
import { ProductDetailView } from '@/components/product-detail-view'

export default function Home() {
  const { view, authModalOpen, authMode, closeAuth } = useAppStore()

  const renderView = () => {
    switch (view) {
      case 'search': return <SearchView />
      case 'cart': return <CartView />
      case 'orders': return <OrdersView />
      case 'profile': return <ProfileView />
      case 'vendor': return <VendorView />
      case 'admin': return <AdminView />
      case 'product': return <ProductDetailView />
      default: return <HomeView />
    }
  }

  const showFooter = ['home', 'search', 'cart', 'orders', 'profile'].includes(view)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-[1440px] px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
      <BottomNav />
      <AuthModal open={authModalOpen} onClose={closeAuth} mode={authMode} />
    </div>
  )
}
