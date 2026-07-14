'use client'

import { useAppStore } from '@/lib/store'
import { t } from '@/lib/i18n'
import { paymentMethods } from '@/lib/data'
import { motion } from 'framer-motion'
import {
  Wallet, Plus, ArrowDownLeft, ArrowUpRight, QrCode, Send,
  Gift, TrendingUp, Sparkles, CreditCard, History,
} from 'lucide-react'
import { toast } from 'sonner'

const transactions = [
  { id: 1, type: 'cashback', title: 'Coffee bundle cashback', amount: 53, time: '2 hours ago', icon: Gift },
  { id: 2, type: 'payment', title: 'Samsung Galaxy A15', amount: -18900, time: 'Yesterday', icon: ArrowUpRight },
  { id: 3, type: 'topup', title: 'Telebirr top-up', amount: 5000, time: '2 days ago', icon: ArrowDownLeft },
  { id: 4, type: 'cashback', title: 'Grocery savings', amount: 230, time: '3 days ago', icon: Gift },
  { id: 5, type: 'payment', title: 'Teff Flour + Berbere', amount: -800, time: '4 days ago', icon: ArrowUpRight },
  { id: 6, type: 'topup', title: 'CBE Birr transfer', amount: 3000, time: '1 week ago', icon: ArrowDownLeft },
]

export function WalletView() {
  const { language } = useAppStore()
  const walletBalance = 2840
  const cashbackEarned = 1320

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-black">{t(language, 'wallet')}</h1>
        <p className="text-sm text-muted-foreground">Manage your money & payments</p>
      </div>

      {/* Wallet balance card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-emerald p-6 text-primary-foreground shadow-glow"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Gebeya Wallet</span>
            </div>
            <span className="text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded-full font-bold">PREMIUM</span>
          </div>
          <div className="text-4xl font-black mb-1">{walletBalance.toLocaleString()} <span className="text-xl">ETB</span></div>
          <p className="text-sm text-white/80">{t(language, 'walletBalance')}</p>
          <div className="grid grid-cols-3 gap-2 mt-5">
            <button
              onClick={() => toast.success('Top-up menu opened')}
              className="flex flex-col items-center gap-1 rounded-xl bg-white/15 backdrop-blur-md py-3 hover:bg-white/25 transition-colors tap-highlight-none"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs font-semibold">{t(language, 'topUp')}</span>
            </button>
            <button
              onClick={() => toast.success('QR scanner opened')}
              className="flex flex-col items-center gap-1 rounded-xl bg-white/15 backdrop-blur-md py-3 hover:bg-white/25 transition-colors tap-highlight-none"
            >
              <QrCode className="h-4 w-4" />
              <span className="text-xs font-semibold">Scan & Pay</span>
            </button>
            <button
              onClick={() => toast.success('Send money opened')}
              className="flex flex-col items-center gap-1 rounded-xl bg-white/15 backdrop-blur-md py-3 hover:bg-white/25 transition-colors tap-highlight-none"
            >
              <Send className="h-4 w-4" />
              <span className="text-xs font-semibold">Send</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Cashback & rewards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl glass p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 mb-2">
            <Gift className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-black">{cashbackEarned.toLocaleString()} ETB</div>
          <div className="text-xs text-muted-foreground">Total Cashback Earned</div>
        </div>
        <div className="rounded-2xl glass p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black">8,450 ETB</div>
          <div className="text-xs text-muted-foreground">Total Savings</div>
        </div>
      </div>

      {/* Payment methods */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {t(language, 'paymentMethods')}
          </h2>
          <button className="text-sm font-semibold text-primary">Add New</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {paymentMethods.slice(0, 6).map((pm, i) => (
            <motion.button
              key={pm.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => toast.info(`${pm.name} selected`)}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${pm.color} p-4 text-white text-left shadow-premium hover:shadow-glow transition-all tap-highlight-none`}
            >
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10" />
              <div className="text-2xl mb-2">{pm.icon}</div>
              <div className="font-bold text-sm">{pm.name}</div>
              {pm.balance !== undefined && (
                <div className="text-xs text-white/85 mt-0.5">{pm.balance.toLocaleString()} ETB</div>
              )}
              <div className="text-[10px] text-white/70 mt-1 line-clamp-1">{pm.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* AI savings tip */}
      <div className="rounded-2xl gradient-mesh p-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-emerald text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="font-bold text-sm">AI Insight</div>
          <p className="text-sm text-muted-foreground mt-0.5">
            You've saved 8,450 ETB this year! Use Gebeya Wallet for payments to earn an extra 5% cashback on every order.
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            {t(language, 'transactions')}
          </h2>
          <button className="text-sm font-semibold text-primary">View All</button>
        </div>
        <div className="space-y-2">
          {transactions.map((tx, i) => {
            const Icon = tx.icon
            const isPositive = tx.amount > 0
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl glass p-3"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{tx.title}</div>
                  <div className="text-xs text-muted-foreground">{tx.time}</div>
                </div>
                <div className={`font-bold text-sm ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                  {isPositive ? '+' : ''}{tx.amount.toLocaleString()} ETB
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
