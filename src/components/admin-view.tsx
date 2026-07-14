'use client'

import { motion } from 'framer-motion'
import {
  Users, Store, DollarSign, TrendingUp, Activity, ShoppingCart,
  ArrowUpRight, ArrowDownRight, Star, Package, AlertCircle,
  Shield, Sparkles, MapPin, Eye, UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

const revenueData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 72 },
  { month: 'Mar', value: 68 },
  { month: 'Apr', value: 85 },
  { month: 'May', value: 92 },
  { month: 'Jun', value: 105 },
  { month: 'Jul', value: 98 },
  { month: 'Aug', value: 112 },
  { month: 'Sep', value: 125 },
  { month: 'Oct', value: 118 },
  { month: 'Nov', value: 134 },
  { month: 'Dec', value: 142 },
]

const cityData = [
  { city: 'Addis Ababa', sales: 45, percent: 85 },
  { city: 'Adama', sales: 18, percent: 42 },
  { city: 'Bahir Dar', sales: 14, percent: 38 },
  { city: 'Hawassa', sales: 12, percent: 35 },
  { city: 'Mekelle', sales: 9, percent: 28 },
  { city: 'Jimma', sales: 7, percent: 22 },
]

export function AdminView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'fraud' | 'ai'>('overview')

  const stats = [
    { icon: Users, label: 'Total Users', value: '2.4M', change: '+12.5%', up: true, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Store, label: 'Active Vendors', value: '8,547', change: '+8.2%', up: true, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { icon: DollarSign, label: 'Revenue (Month)', value: '142M', unit: 'ETB', change: '+18.4%', up: true, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
    { icon: TrendingUp, label: 'Conversion Rate', value: '4.8%', change: '+0.6%', up: true, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-6 text-white shadow-premium">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <Shield className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-black">Admin Control Panel</h1>
              <p className="text-sm text-white/70">Real-time platform analytics</p>
            </div>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 text-xs font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYSTEM HEALTHY
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'vendors', label: 'Vendors', icon: Store },
          { id: 'fraud', label: 'Fraud Monitor', icon: Shield },
          { id: 'ai', label: 'AI Settings', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors tap-highlight-none ${
                active ? 'gradient-emerald text-primary-foreground shadow-glow' : 'glass hover:shadow-premium'
              }`}
            >
              <Icon className="h-4 w-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl glass p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <span className={`flex items-center gap-0.5 text-xs font-bold ${stat.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black">{stat.value}</span>
                    {stat.unit && <span className="text-xs text-muted-foreground">{stat.unit}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Revenue chart */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">Annual Revenue Growth</h3>
                <p className="text-xs text-muted-foreground">Monthly revenue in millions ETB</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +18.4% YoY
              </span>
            </div>
            <div className="flex items-end justify-between gap-1.5 h-48">
              {revenueData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${d.value}%` }}
                      transition={{ delay: i * 0.05, duration: 0.6 }}
                      className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 relative group cursor-pointer"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.value}M
                      </span>
                    </motion.div>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* City heatmap */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-bold">Sales by City</h3>
                <p className="text-xs text-muted-foreground">Geographic distribution</p>
              </div>
            </div>
            <div className="space-y-3">
              {cityData.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-medium truncate">{c.city}</div>
                  <div className="flex-1 h-7 rounded-lg bg-accent overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.percent}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="h-full rounded-lg gradient-emerald flex items-center justify-end pr-2"
                    >
                      <span className="text-[10px] font-bold text-primary-foreground">{c.sales}k</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live activity */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-bold">Live Activity</h3>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="space-y-2">
              {[
                { icon: ShoppingCart, text: 'New order from Addis Ababa', value: '8,500 ETB', time: '2s ago' },
                { icon: UserPlus, text: 'New user registered', value: 'Selam T.', time: '8s ago' },
                { icon: Store, text: 'New vendor application', value: 'Coffee Co.', time: '15s ago' },
                { icon: ShoppingCart, text: 'Bulk order placed', value: '24,000 ETB', time: '32s ago' },
                { icon: Star, text: '5-star review received', value: 'Yirgacheffe', time: '45s ago' },
              ].map((a, i) => {
                const Icon = a.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl bg-accent/30 p-2.5"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{a.text}</div>
                      <div className="text-[10px] text-muted-foreground">{a.time}</div>
                    </div>
                    <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{a.value}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Vendors */}
      {activeTab === 'vendors' && (
        <div className="space-y-3">
          {[
            { name: 'TechHub Addis', revenue: '28.9M ETB', products: 890, rating: 4.6, status: 'active' },
            { name: 'Addis Coffee Co.', revenue: '8.4M ETB', products: 145, rating: 4.9, status: 'active' },
            { name: 'Maru Habesha Fashion', revenue: '18.9M ETB', products: 234, rating: 4.9, status: 'active' },
            { name: 'Highland Grains', revenue: '4.5M ETB', products: 56, rating: 4.7, status: 'active' },
            { name: 'Spice Garden Ethiopia', revenue: '2.3M ETB', products: 78, rating: 4.8, status: 'pending' },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl glass p-4 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-emerald text-primary-foreground font-bold">
                {v.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{v.name}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{v.products} products</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {v.rating}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{v.revenue}</div>
                <span className={`text-[10px] font-bold ${v.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {v.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fraud Monitor */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-5 text-center">
            <Shield className="h-12 w-12 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
            <h3 className="font-black text-lg">All Systems Safe</h3>
            <p className="text-sm text-muted-foreground">AI fraud detection is active 24/7</p>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">0</div>
                <div className="text-[10px] text-muted-foreground">Active Threats</div>
              </div>
              <div>
                <div className="text-2xl font-black">847</div>
                <div className="text-[10px] text-muted-foreground">Blocked Today</div>
              </div>
              <div>
                <div className="text-2xl font-black">99.8%</div>
                <div className="text-[10px] text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {[
            { icon: AlertCircle, title: 'Suspicious login blocked', desc: 'Unknown device from Dire Dawa', time: '5 min ago', severity: 'warning' },
            { icon: Shield, title: 'Payment verified', desc: 'Telebirr transaction confirmed', time: '12 min ago', severity: 'safe' },
            { icon: AlertCircle, title: 'Bulk order flagged', desc: 'Unusual quantity detected, AI approved', time: '1 hour ago', severity: 'warning' },
          ].map((alert, i) => {
            const Icon = alert.icon
            return (
              <div key={i} className={`rounded-2xl glass p-4 flex items-start gap-3 ${
                alert.severity === 'warning' ? 'border-l-4 border-amber-500' : 'border-l-4 border-emerald-500'
              }`}>
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${alert.severity === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                <div className="flex-1">
                  <div className="font-bold text-sm">{alert.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{alert.desc}</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-1">{alert.time}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* AI Settings */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="rounded-2xl gradient-emerald p-5 text-primary-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-bold">AI Engine Status</h3>
            </div>
            <p className="text-sm text-white/90">Gebeya AI is running optimally across all modules</p>
          </div>

          {[
            { name: 'Shopping Assistant', status: 'Active', desc: 'Handles 12,400 queries/day', color: 'text-emerald-600 dark:text-emerald-400' },
            { name: 'Price Prediction', status: 'Active', desc: '94% accuracy rate', color: 'text-emerald-600 dark:text-emerald-400' },
            { name: 'Recommendation Engine', status: 'Active', desc: 'Personalized for 2.4M users', color: 'text-emerald-600 dark:text-emerald-400' },
            { name: 'Fraud Detection', status: 'Active', desc: 'Blocked 847 threats today', color: 'text-emerald-600 dark:text-emerald-400' },
            { name: 'Seller AI Tools', status: 'Active', desc: 'Used by 8,547 vendors', color: 'text-emerald-600 dark:text-emerald-400' },
            { name: 'Voice Recognition', status: 'Active', desc: 'Supports 5 languages', color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((ai, i) => (
            <div key={i} className="rounded-2xl glass p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">{ai.name}</div>
                <div className="text-xs text-muted-foreground">{ai.desc}</div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold ${ai.color}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {ai.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
