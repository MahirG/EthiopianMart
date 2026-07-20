'use client'

import { signOut, useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { LogOut, Moon, PackageCheck, ShieldCheck, Store, Sun, UserRound } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { LanguageSelector } from './language-selector'

async function fetchOrderSummary(): Promise<Array<{ id: string; total: number; status: string }>> {
  const response = await fetch('/api/orders')
  if (!response.ok) return []
  return response.json()
}

export function ProfileView() {
  const { data: session, status } = useSession()
  const { openAuth, setView, theme, toggleTheme, wishlist } = useAppStore()
  const orders = useQuery({ queryKey: ['orders-summary'], queryFn: fetchOrderSummary, enabled: status === 'authenticated' })
  const role = (session?.user as { role?: string } | undefined)?.role ?? 'USER'

  if (status === 'loading') return <div className="grid min-h-[440px] place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
  if (!session?.user) return <div className="mx-auto flex min-h-[480px] max-w-lg flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10"><UserRound className="h-7 w-7 text-primary" /></span><h1 className="mt-6 text-2xl font-black">Your EthiopianMart account</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Sign in to manage orders, delivery details, wishlists, and seller tools.</p><div className="mt-6 flex gap-3"><button onClick={() => openAuth('login')} className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Sign in</button><button onClick={() => openAuth('register')} className="rounded-full border border-border px-6 py-3 text-sm font-bold">Create account</button></div></div>

  const initials = session.user.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'EM'
  const completed = orders.data?.filter((order) => order.status === 'DELIVERED').length ?? 0

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <section className="flex flex-col justify-between gap-6 rounded-[28px] bg-[#0f5132] p-7 text-white sm:flex-row sm:items-center">
        <div className="flex items-center gap-4"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-xl font-black">{initials}</span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#f3c64d]">{role.toLowerCase()} account</p><h1 className="mt-1 text-2xl font-black">{session.user.name}</h1><p className="mt-1 text-sm text-white/65">{session.user.email}</p></div></div>
        <button onClick={async () => { await signOut({ redirect: false }); setView('home') }} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold"><LogOut className="h-4 w-4" /> Sign out</button>
      </section>

      <div className="grid grid-cols-3 gap-3">{[
        ['Orders', orders.data?.length ?? 0], ['Delivered', completed], ['Wishlist', wishlist.length],
      ].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-card p-5 text-center"><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs font-semibold text-muted-foreground">{label}</p></div>)}</div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <button onClick={() => setView('orders')} className="flex w-full items-center gap-4 border-b border-border p-5 text-left"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10"><PackageCheck className="h-5 w-5 text-primary" /></span><div><p className="text-sm font-extrabold">Orders and delivery</p><p className="text-xs text-muted-foreground">Track real purchases and delivery status</p></div></button>
        {(role === 'VENDOR' || role === 'ADMIN') && <button onClick={() => setView(role === 'ADMIN' ? 'admin' : 'vendor')} className="flex w-full items-center gap-4 border-b border-border p-5 text-left"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10"><Store className="h-5 w-5 text-primary" /></span><div><p className="text-sm font-extrabold">{role === 'ADMIN' ? 'Admin workspace' : 'Seller portal'}</p><p className="text-xs text-muted-foreground">Manage marketplace operations</p></div></button>}
        <div className="flex items-center justify-between gap-4 p-5"><div className="flex items-center gap-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">{theme === 'light' ? <Sun className="h-5 w-5 text-primary" /> : <Moon className="h-5 w-5 text-primary" />}</span><div><p className="text-sm font-extrabold">Appearance</p><p className="text-xs text-muted-foreground">Choose light or dark mode</p></div></div><button onClick={toggleTheme} className="rounded-full border border-border px-4 py-2 text-xs font-bold">{theme === 'light' ? 'Use dark' : 'Use light'}</button></div>
      </section>

      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center"><div className="flex gap-4"><ShieldCheck className="h-6 w-6 text-primary" /><div><p className="text-sm font-extrabold">Account and language</p><p className="mt-1 text-xs text-muted-foreground">Your session is protected with secure, HTTP-only authentication cookies.</p></div></div><LanguageSelector /></section>
    </div>
  )
}
