'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { categories, products } from '@/lib/data'
import { ProductCard } from './product-card'
import { motion } from 'framer-motion'
import {
  Sparkles, TrendingUp, Flame, Clock, ChevronRight, Crown, Zap,
  TrendingDown, Wallet, Gift, Shield, Truck, Award, Star, MapPin,
} from 'lucide-react'
import { useState, useEffect } from 'react'

const heroSlides = [
  {
    title: 'Mega Ethiopian Sale',
    subtitle: 'Up to 40% off on local products',
    cta: 'Shop Deals',
    gradient: 'from-emerald-600 via-teal-600 to-green-700',
    emoji: '🛍️',
    badge: 'Limited Time',
  },
  {
    title: 'Fresh Yirgacheffe Coffee',
    subtitle: 'Direct from farmers, save 23%',
    cta: 'Buy Coffee',
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    emoji: '☕',
    badge: 'Just Arrived',
  },
  {
    title: 'Tech Festival',
    subtitle: 'Samsung, JBL & more — lowest prices',
    cta: 'Shop Electronics',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    emoji: '📱',
    badge: 'Flash Sale',
  },
]

function CountdownTimer() {
  const [time, setTime] = useState({ h: 2, m: 34, s: 12 })
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 23 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  const pad = (n: number) => n.toString().padStart(2, '0')
  return (
    <div className="flex items-center gap-1">
      {[time.h, time.m, time.s].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-sm font-bold text-white tabular-nums">
            {pad(v)}
          </span>
          {i < 2 && <span className="text-white/70">:</span>}
        </span>
      ))}
    </div>
  )
}

// Stagger container for reveal animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export function HomeView() {
  const { language, setView, setAiOpen } = useAppStore()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((s) => (s + 1) % heroSlides.length)
    }, 5500)
    return () => clearInterval(interval)
  }, [])

  const trending = products.slice(0, 6)
  const deals = products.filter((p) => p.discount && p.discount >= 20).slice(0, 6)
  const newArrivals = [...products].reverse().slice(0, 6)

  return (
    <div className="space-y-8 sm:space-y-10 pb-8">
      {/* Hero Carousel */}
      <section className="relative" aria-label="Featured promotions">
        <div className="relative overflow-hidden rounded-3xl shadow-float">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`relative bg-gradient-to-br ${heroSlides[activeSlide].gradient} px-6 py-10 sm:px-12 sm:py-16 min-h-[280px] sm:min-h-[360px] flex items-center`}
          >
            {/* Decorative blobs — dynamic lighting */}
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute top-1/2 left-1/4 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10 max-w-lg">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white"
              >
                <Zap className="h-3 w-3" /> {heroSlides[activeSlide].badge}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-4 text-3xl sm:text-5xl font-black text-white leading-tight font-display tracking-tight text-balance"
              >
                {heroSlides[activeSlide].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-2 text-base sm:text-lg text-white/90 font-medium"
              >
                {heroSlides[activeSlide].subtitle}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => setView('search')}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-gray-900 shadow-xl tap-highlight-none"
              >
                {heroSlides[activeSlide].cta}
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Big emoji — floating animation */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-6 sm:right-16 top-1/2 -translate-y-1/2 text-8xl sm:text-9xl opacity-90 drop-shadow-2xl"
            >
              {heroSlides[activeSlide].emoji}
            </motion.div>

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-6 flex gap-1.5">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeSlide ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick stats bar */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { icon: Wallet, label: 'You Saved', value: '8,450 ETB', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: TrendingDown, label: 'Price Alerts', value: '12 active', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
          { icon: Truck, label: 'Free Delivery', value: 'Eligible', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
          { icon: Gift, label: 'Cashback', value: '320 ETB', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="rounded-2xl glass p-4 transition-shadow hover:shadow-premium"
            >
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-lg font-black tracking-tight">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          )
        })}
      </motion.section>

      {/* AI Savings Insights */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl liquid-glass p-6 sm:p-8 shadow-float relative overflow-hidden"
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-emerald text-primary-foreground shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">AI Savings Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-4 font-display tracking-tight text-balance">
            You can save <span className="text-gradient-emerald">530 Birr</span> today! 🎉
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { title: 'Bundle Deal', desc: 'Coffee + Berbere + Teff = Save 530 ETB', icon: Gift },
              { title: 'Price Prediction', desc: 'Wait till Friday for 18% extra off', icon: TrendingDown },
              { title: 'Nearby Store', desc: 'Highland Grains is 12% cheaper', icon: MapPin },
            ].map((tip, i) => {
              const Icon = tip.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-2xl glass-strong p-4"
                >
                  <Icon className="h-5 w-5 mb-2 text-emerald-600 dark:text-emerald-400" />
                  <div className="font-bold text-sm">{tip.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{tip.desc}</div>
                </motion.div>
              )
            })}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setAiOpen(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full gradient-emerald px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow tap-highlight-none"
          >
            <Sparkles className="h-4 w-4" /> Chat with AI Assistant
          </motion.button>
        </div>
      </motion.section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black font-display tracking-tight">
            <span className="text-gradient-emerald">{t(language, 'categories')}</span>
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            {t(language, 'viewAll')} <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3"
        >
          {categories.slice(0, 8).map((cat) => (
            <motion.button
              key={cat.id}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('search')}
              className="group flex flex-col items-center gap-2 p-2 tap-highlight-none"
              aria-label={`Browse ${cat.name}`}
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-2xl shadow-premium group-hover:shadow-glow transition-shadow`}>
                <span className="group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
              </div>
              <span className="text-[11px] font-medium text-center line-clamp-2 leading-tight text-balance">{cat.name}</span>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Flash Sale */}
      <section className="rounded-3xl glass p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-gold text-white shadow-glow-gold">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display tracking-tight">{t(language, 'flashSale')}</h2>
              <p className="text-xs text-muted-foreground">{t(language, 'endingSoon')}</p>
            </div>
          </div>
          <CountdownTimer />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {deals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Membership Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 sm:p-8 text-white shadow-float"
      >
        <motion.div
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-10 -bottom-10 text-9xl opacity-20"
        >
          👑
        </motion.div>
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wide">Gebeya Membership</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2 font-display tracking-tight text-balance">Unlock Premium Savings</h2>
          <p className="text-white/90 mb-4">Free delivery, 20% cashback, exclusive deals & VIP AI concierge.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Free Delivery', '20% Cashback', 'VIP Support', 'Early Access'].map((b) => (
              <span key={b} className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold">
                {b}
              </span>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setView('profile')}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-purple-700 shadow-xl tap-highlight-none"
          >
            <Crown className="h-4 w-4" /> {t(language, 'joinNow')} — from 299 ETB{t(language, 'perMonth')}
          </motion.button>
        </div>
      </motion.section>

      {/* Trending */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black flex items-center gap-2 font-display tracking-tight">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-gradient-emerald">{t(language, 'trending')}</span>
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            {t(language, 'viewAll')} <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Shield, title: 'Secure Payments', desc: 'Bank-grade encryption' },
          { icon: Truck, title: 'Fast Delivery', desc: 'Same-day in Addis Ababa' },
          { icon: Award, title: 'Verified Vendors', desc: 'Trusted local sellers' },
          { icon: Star, title: '24/7 Support', desc: 'AI + human help' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 rounded-2xl glass p-4 transition-shadow hover:shadow-premium"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            </motion.div>
          )
        })}
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black flex items-center gap-2 font-display tracking-tight">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-gradient-emerald">{t(language, 'newArrivals')}</span>
          </h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all"
          >
            {t(language, 'viewAll')} <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Stats footer */}
      <section className="rounded-3xl gradient-mesh p-6 sm:p-8 text-center">
        <h3 className="text-lg font-black mb-4 font-display tracking-tight">{t(language, 'trustedBy')} millions of Ethiopians</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '2.4M+', label: t(language, 'happyShoppers') },
            { value: '50K+', label: t(language, 'productsAvailable') },
            { value: '8.5K+', label: t(language, 'localVendors') },
            { value: '120+', label: t(language, 'citiesServed') },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            >
              <div className="text-2xl sm:text-3xl font-black text-gradient-emerald font-display tracking-tight">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
