'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, BadgeCheck, Coffee, Gem, Landmark, MapPin, PackageCheck, Scissors, ShieldCheck, Store, Truck, Wheat } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchCatalogCategories, fetchCatalogProducts } from '@/lib/catalog'
import { useAppStore } from '@/lib/store'
import { ProductCard } from './product-card'
import { CategoryGlyph } from './category-glyph'

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] skeleton-premium" />
      <div className="space-y-3 p-4"><div className="h-3 w-20 rounded skeleton-premium" /><div className="h-4 w-full rounded skeleton-premium" /><div className="h-5 w-24 rounded skeleton-premium" /></div>
    </div>
  )
}

export function HomeView() {
  const { setView, setCatalogCategory, setCatalogLocal } = useAppStore()
  const categoriesQuery = useQuery({ queryKey: ['catalog-categories'], queryFn: fetchCatalogCategories })
  const latestQuery = useQuery({
    queryKey: ['catalog-products', 'latest'],
    queryFn: () => fetchCatalogProducts({ limit: 8, sort: 'newest' }),
  })
  const localQuery = useQuery({
    queryKey: ['catalog-products', 'local'],
    queryFn: () => fetchCatalogProducts({ limit: 8, isLocal: true, sort: 'rating' }),
  })

  const shopLocal = () => {
    setCatalogCategory('all')
    setCatalogLocal(true)
  }

  return (
    <div className="space-y-16 pb-8 sm:space-y-20">
      <section className="relative overflow-hidden rounded-[28px] bg-[#0b3d2a] text-white sm:rounded-[36px]">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0%,transparent_45%,rgba(243,198,77,.24)_45%,rgba(243,198,77,.24)_52%,transparent_52%,transparent_61%,rgba(200,74,52,.25)_61%,rgba(200,74,52,.25)_67%,transparent_67%)]" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[42px] border-white/5" />
        <div className="relative grid min-h-[480px] items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1.1fr_.9fr] lg:px-16 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#f3c64d]">
              <BadgeCheck className="h-4 w-4" /> Ethiopia&apos;s home marketplace
            </span>
            <p lang="am" className="font-ethiopic mt-7 text-sm font-semibold text-white/65">ከኢትዮጵያ፣ ለኢትዮጵያ</p>
            <h1 className="mt-3 max-w-3xl text-[clamp(2.65rem,7vw,5.6rem)] font-black leading-[.92] tracking-[-0.065em] text-white">
              Good things,<br /><span className="text-[#f3c64d]">made closer.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
              Discover trusted sellers, remarkable Ethiopian products, and everyday essentials—delivered across the country.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={shopLocal} className="inline-flex items-center gap-2 rounded-full bg-[#f3c64d] px-6 py-3.5 text-sm font-extrabold text-[#173326] transition hover:-translate-y-0.5 hover:bg-[#ffda68]">
                Shop made in Ethiopia <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setView('search')} className="rounded-full border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10">Browse everything</button>
            </div>
          </motion.div>

          <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
            <div className="aspect-square rotate-3 rounded-[42px] border border-white/15 bg-white/[.07] p-7 backdrop-blur-sm">
              <div className="grid h-full grid-cols-2 gap-4">
                {[
                  [Coffee, 'Yirgacheffe'], [Scissors, 'Handwoven'], [Wheat, 'From our farms'], [Gem, 'Local craft'],
                ].map(([Icon, label], index) => {
                  const FeatureIcon = Icon as typeof Coffee
                  return <div key={label as string} className={`flex flex-col justify-end rounded-3xl border border-white/10 bg-white/10 p-5 ${index === 1 || index === 2 ? 'translate-y-5' : ''}`}>
                    <FeatureIcon className="h-10 w-10 text-[#f3c64d]" /><span className="mt-4 text-xs font-bold text-white/75">{label as string}</span>
                  </div>
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="categories-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Start here</p><h2 id="categories-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">Shop by category</h2></div>
          <button onClick={() => setView('search')} className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">View all <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {(categoriesQuery.data ?? []).slice(0, 8).map((category) => (
            <button key={category.id} onClick={() => { setCatalogLocal(false); setCatalogCategory(category.id) }} className="group flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-transparent p-2 text-center transition hover:border-border hover:bg-card hover:shadow-sm">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-primary transition group-hover:-translate-y-1 group-hover:bg-primary/10"><CategoryGlyph category={category.id} /></span>
              <span className="line-clamp-2 text-[11px] font-bold leading-tight">{category.name}</span>
            </button>
          ))}
          {categoriesQuery.isLoading && Array.from({ length: 8 }).map((_, index) => <div key={index} className="mx-auto h-20 w-16 rounded-2xl skeleton-premium" />)}
        </div>
      </section>

      <section aria-labelledby="local-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#c84a34]">Rooted here</p><h2 id="local-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">Made in Ethiopia</h2><p className="mt-2 text-sm text-muted-foreground">Products that carry local skill, ingredients, and livelihoods forward.</p></div>
          <button onClick={shopLocal} className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">Explore local <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {localQuery.data?.products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          {localQuery.isLoading && Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)}
        </div>
        {localQuery.isError && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center"><p className="font-bold">We couldn&apos;t load local products.</p><button onClick={() => localQuery.refetch()} className="mt-3 text-sm font-bold text-primary">Try again</button></div>
        )}
      </section>

      <section className="grid overflow-hidden rounded-[28px] border border-border bg-card lg:grid-cols-[.8fr_1.2fr]">
        <div className="bg-[#f1e9d7] p-8 text-[#173326] sm:p-10 lg:p-12">
          <Store className="h-9 w-9" />
          <h2 className="mt-8 text-3xl font-black sm:text-4xl">Your work deserves a bigger market.</h2>
          <p className="mt-4 max-w-md leading-7 text-[#365644]">Open your EthiopianMart seller portal, manage real inventory and orders, and reach customers beyond your neighborhood.</p>
          <button onClick={() => setView('vendor')} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0f5132] px-6 py-3 text-sm font-bold text-white">Open seller portal <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4 lg:grid-cols-2">
          {[
            [BadgeCheck, 'Verified sellers', 'Seller identity and ownership checks'],
            [PackageCheck, 'Real inventory', 'Stock-aware product and order flows'],
            [Landmark, 'Local payments', 'Telebirr, CBE Birr, Chapa and cash'],
            [MapPin, 'Ethiopian delivery', 'Address and order tracking built in'],
          ].map(([Icon, title, description]) => {
            const FeatureIcon = Icon as typeof BadgeCheck
            return <div key={title as string} className="bg-background p-6 sm:p-8"><FeatureIcon className="h-6 w-6 text-primary" /><h3 className="mt-5 text-base font-extrabold">{title as string}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{description as string}</p></div>
          })}
        </div>
      </section>

      <section aria-labelledby="new-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Fresh to market</p><h2 id="new-title" className="mt-2 text-2xl font-extrabold sm:text-3xl">New arrivals</h2></div>
          <button onClick={() => setView('search')} className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">Shop all <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {latestQuery.data?.products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          {latestQuery.isLoading && Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)}
        </div>
      </section>

      <section className="grid gap-4 border-y border-border py-8 sm:grid-cols-3">
        {[
          [ShieldCheck, 'Shop with confidence', 'Secure authentication and protected transactions.'],
          [Truck, 'Delivery that fits Ethiopia', 'Clear delivery times and order status at every step.'],
          [Store, 'Local businesses first', 'A marketplace built to help Ethiopian sellers grow.'],
        ].map(([Icon, title, description]) => {
          const TrustIcon = Icon as typeof ShieldCheck
          return <div key={title as string} className="flex gap-4 p-3"><TrustIcon className="h-6 w-6 shrink-0 text-primary" /><div><h3 className="text-sm font-extrabold">{title as string}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{description as string}</p></div></div>
        })}
      </section>
    </div>
  )
}
