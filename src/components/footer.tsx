'use client'

import { ArrowUpRight, MapPin } from 'lucide-react'
import { BrandMark } from './brand-mark'
import { useAppStore } from '@/lib/store'

export function Footer() {
  const { setView, setCatalogLocal } = useAppStore()
  const go = (view: 'home' | 'search' | 'orders' | 'profile' | 'vendor' | 'cart') => setView(view)

  return (
    <footer className="mt-12 bg-[#0a2f22] text-white lg:mt-20">
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <BrandMark inverse />
            <p className="mt-6 text-sm leading-6 text-white/65">A trusted digital market for Ethiopian products, independent sellers, and everyday shopping.</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/70"><MapPin className="h-4 w-4 text-[#f3c64d]" /> Built in Addis Ababa for Ethiopia</div>
          </div>

          <FooterGroup title="Shop" items={[
            ['All products', () => go('search')],
            ['Made in Ethiopia', () => { setCatalogLocal(true); go('search') }],
            ['Cart', () => go('cart')],
            ['Track order', () => go('orders')],
          ]} />
          <FooterGroup title="Account" items={[
            ['My profile', () => go('profile')],
            ['My orders', () => go('orders')],
            ['Seller portal', () => go('vendor')],
          ]} />
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-[.16em] text-[#f3c64d]">Payments</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Telebirr', 'CBE Birr', 'Chapa', 'SantimPay', 'Cash'].map((method) => <span key={method} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px] font-semibold text-white/70">{method}</span>)}
            </div>
            <button onClick={() => go('profile')} className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-white">Get support <ArrowUpRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[10px] font-medium text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EthiopianMart. All rights reserved.</p>
          <p>Simple. Local. Trusted.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterGroup({ title, items }: { title: string; items: [string, () => void][] }) {
  return (
    <div>
      <h2 className="text-xs font-extrabold uppercase tracking-[.16em] text-[#f3c64d]">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items.map(([label, action]) => <button key={label} onClick={action} className="w-fit text-left text-xs font-semibold text-white/65 transition hover:text-white">{label}</button>)}
      </div>
    </div>
  )
}
