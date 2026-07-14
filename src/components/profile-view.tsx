'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { membershipTiers } from '@/lib/data'
import { motion } from 'framer-motion'
import {
  Crown, Check, Star, Package, Heart, MapPin, Settings, HelpCircle,
  Shield, Bell, Globe, LogOut, ChevronRight, Sparkles, TrendingUp,
  Fingerprint, Smartphone, Award, Gift, Store,
} from 'lucide-react'
import { toast } from 'sonner'

export function ProfileView() {
  const { language, setView, theme, toggleTheme, wishlist } = useAppStore()

  const menuItems = [
    { icon: Package, label: t(language, 'myOrders'), action: () => setView('orders'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Heart, label: t(language, 'wishlist'), badge: wishlist.length, action: () => toast.info('Wishlist opened'), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
    { icon: MapPin, label: t(language, 'addresses'), action: () => toast.info('Addresses opened'), color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
    { icon: Bell, label: 'Notifications', action: () => toast.info('Notifications opened'), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Globe, label: 'Language & Region', action: () => toast.info('Language settings'), color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10' },
    { icon: Shield, label: t(language, 'security'), action: () => toast.info('Security settings'), color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10' },
    { icon: Settings, label: t(language, 'accountSettings'), action: () => toast.info('Settings opened'), color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10' },
    { icon: HelpCircle, label: t(language, 'helpCenter'), action: () => toast.info('Help center opened'), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-emerald p-6 text-primary-foreground shadow-glow"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-2xl font-black">
              AB
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full gradient-gold text-[10px] font-bold text-white shadow-glow-gold">
              <Crown className="h-3 w-3" />
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black">Abebe Bekele</h2>
            <p className="text-sm text-white/85">+251 911 234 567</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold">
                <Crown className="h-2.5 w-2.5" /> GOLD MEMBER
              </span>
              <span className="text-[10px] text-white/80">since 2023</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {[
            { label: 'Orders', value: '47' },
            { label: 'Saved', value: '8,450 ETB' },
            { label: 'Rewards', value: '1,320 ETB' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl bg-white/15 backdrop-blur-md p-3 text-center">
              <div className="text-sm font-black">{stat.value}</div>
              <div className="text-[10px] text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick access dashboards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setView('vendor')}
          className="rounded-2xl glass p-4 text-left hover:shadow-premium transition-all tap-highlight-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 mb-2">
            <Store className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="font-bold text-sm">{t(language, 'sellOn')}</div>
          <div className="text-xs text-muted-foreground">Vendor dashboard</div>
        </button>
        <button
          onClick={() => setView('admin')}
          className="rounded-2xl glass p-4 text-left hover:shadow-premium transition-all tap-highlight-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10 mb-2">
            <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="font-bold text-sm">{t(language, 'adminPanel')}</div>
          <div className="text-xs text-muted-foreground">Platform analytics</div>
        </button>
      </div>

      {/* Security quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Fingerprint, label: 'Biometrics', desc: 'Enabled', color: 'text-emerald-600 dark:text-emerald-400' },
          { icon: Smartphone, label: 'Passkeys', desc: 'Active', color: 'text-violet-600 dark:text-violet-400' },
          { icon: Shield, label: '2FA', desc: 'On', color: 'text-amber-600 dark:text-amber-400' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="flex flex-col items-center gap-1 rounded-2xl glass p-4 text-center">
              <Icon className={`h-5 w-5 ${item.color}`} />
              <div className="font-bold text-xs">{item.label}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{item.desc}</div>
            </div>
          )
        })}
      </div>

      {/* Membership tiers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            {t(language, 'membership')}
          </h2>
          <button
            onClick={() => setView('vendor')}
            className="text-sm font-semibold text-primary"
          >
            Become a Seller
          </button>
        </div>
        <div className="space-y-3">
          {membershipTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-5 ${
                tier.popular ? 'glass-strong border-2 border-amber-500/50 shadow-glow-gold' : 'glass'
              }`}
            >
              {tier.popular && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full gradient-gold px-2.5 py-1 text-[10px] font-bold text-white">
                  <Star className="h-2.5 w-2.5 fill-white" /> POPULAR
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tier.color} text-white shadow-premium`}>
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tier.price === 0 ? 'Free forever' : `${tier.price} ETB ${t(language, 'perMonth')}`}
                  </p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {tier.benefits.map((benefit, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              {tier.name !== 'Gold' && (
                <button
                  onClick={() => toast.success(`Upgraded to ${tier.name}! 🎉`)}
                  className={`mt-4 w-full rounded-xl py-2.5 font-bold text-sm tap-highlight-none ${
                    tier.popular
                      ? 'gradient-gold text-white shadow-glow-gold'
                      : 'bg-accent hover:bg-accent/70'
                  }`}
                >
                  {tier.price === 0 ? 'Current Plan' : `Upgrade to ${tier.name}`}
                </button>
              )}
              {tier.name === 'Gold' && (
                <div className="mt-4 w-full rounded-xl gradient-emerald py-2.5 text-center font-bold text-sm text-primary-foreground">
                  Current Plan ✓
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="rounded-2xl glass overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon
          return (
            <button
              key={i}
              onClick={item.action}
              className="flex w-full items-center gap-3 p-3 hover:bg-accent/50 transition-colors tap-highlight-none border-b border-border/30 last:border-0"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bg}`}>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
              {item.badge !== undefined && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )
        })}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="flex w-full items-center justify-between rounded-2xl glass p-4 tap-highlight-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
            {theme === 'light' ? '🌙' : '☀️'}
          </div>
          <span className="font-medium text-sm">Theme</span>
        </div>
        <span className="text-sm font-semibold capitalize">{theme}</span>
      </button>

      {/* Logout */}
      <button
        onClick={() => toast.info('Logout clicked')}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 py-3 font-semibold text-destructive tap-highlight-none hover:bg-destructive/20 transition-colors"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>

      {/* Version */}
      <div className="text-center text-xs text-muted-foreground">
        Gulit.shop v1.0.0 • Made with ❤️ for Africa 🌍
      </div>
    </div>
  )
}
