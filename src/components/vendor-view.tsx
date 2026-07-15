'use client'

import { useAppStore } from '@/lib/store'
import { vendors, products } from '@/lib/data'
import { motion } from 'framer-motion'
import {
  Store, TrendingUp, Package, Users, DollarSign, Star, Plus,
  BarChart3, Settings, Sparkles, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Eye, AlertCircle, Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

const salesData = [
  { day: 'Mon', value: 45 },
  { day: 'Tue', value: 62 },
  { day: 'Wed', value: 58 },
  { day: 'Thu', value: 78 },
  { day: 'Fri', value: 92 },
  { day: 'Sat', value: 88 },
  { day: 'Sun', value: 70 },
]

export function VendorView() {
  const vendor = vendors[1] // TechHub Addis
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'ai'>('overview')

  const stats = [
    { icon: DollarSign, label: 'Sales Today', value: '84,500', unit: 'ETB', change: '+12.5%', up: true, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: ShoppingCart, label: 'Orders', value: '127', unit: '', change: '+8.2%', up: true, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Eye, label: 'Store Visits', value: '2,840', unit: '', change: '+24.1%', up: true, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
    { icon: Star, label: 'Avg Rating', value: '4.6', unit: '/5', change: '+0.2', up: true, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Vendor header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-emerald p-6 text-primary-foreground shadow-glow"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Store className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">{vendor.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold">
                ✓ Verified
              </span>
            </div>
            <p className="text-sm text-white/85">{vendor.location} • {vendor.productCount} products</p>
          </div>
          <button
            onClick={() => toast.success('Add product form opened')}
            className="rounded-xl bg-white text-primary px-4 py-2 text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform tap-highlight-none flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'ai', label: 'AI Tools', icon: Sparkles },
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

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats grid */}
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
                    <span className="text-xl font-black">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.unit}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Sales chart */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold">Weekly Sales</h3>
                <p className="text-xs text-muted-foreground">Last 7 days performance</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                +18.4% vs last week
              </span>
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {salesData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${d.value}%` }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="w-full rounded-t-lg gradient-emerald relative group cursor-pointer"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.value}k
                      </span>
                    </motion.div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top products */}
          <div>
            <h3 className="font-bold mb-3">Top Performing Products</h3>
            <div className="space-y-2">
              {products.slice(0, 4).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl glass p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-2xl">
                    {p.categoryIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{p.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{(120 - i * 20)} sold</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {p.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{(p.price * (8 - i)).toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">ETB revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products tab */}
      {activeTab === 'products' && (
        <div className="space-y-3">
          {products.slice(0, 6).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl glass p-3 flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-2xl">
                {p.categoryIcon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{p.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-sm">{p.price.toLocaleString()} ETB</span>
                  {p.inStock ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      In Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => toast.info('Edit product')}
                className="rounded-lg glass px-3 py-1.5 text-xs font-semibold hover:shadow-premium"
              >
                Edit
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl glass p-5 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-bold mb-1">127 Active Orders</h3>
          <p className="text-sm text-muted-foreground mb-4">Manage and fulfill customer orders</p>
          <button
            onClick={() => toast.success('Orders management opened')}
            className="rounded-full gradient-emerald px-6 py-2.5 font-bold text-sm text-primary-foreground shadow-glow"
          >
            View All Orders
          </button>
        </div>
      )}

      {/* AI Tools tab */}
      {activeTab === 'ai' && (
        <div className="space-y-3">
          <div className="rounded-2xl gradient-emerald p-5 text-primary-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="h-5 w-5" />
              <h3 className="font-bold">Seller AI Assistant</h3>
            </div>
            <p className="text-sm text-white/90">Let AI help you grow your business faster</p>
          </div>

          {[
            { icon: Wand2, title: 'Generate Product Descriptions', desc: 'AI writes compelling descriptions in 5 languages', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
            { icon: TrendingUp, title: 'Demand Forecasting', desc: 'Predict which products will sell next week', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: DollarSign, title: 'Smart Pricing', desc: 'AI suggests optimal prices for maximum profit', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Package, title: 'Inventory Prediction', desc: 'Never run out of stock with AI forecasting', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
            { icon: Users, title: 'Customer Analytics', desc: 'Understand your buyers and their behavior', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Sparkles, title: 'Ad Suggestions', desc: 'AI creates targeted advertising campaigns', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10' },
          ].map((tool, i) => {
            const Icon = tool.icon
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toast.success(`${tool.title} activated!`)}
                className="w-full flex items-center gap-3 rounded-2xl glass p-4 hover:shadow-premium transition-all text-left tap-highlight-none"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tool.bg}`}>
                  <Icon className={`h-5 w-5 ${tool.color}`} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm">{tool.title}</div>
                  <div className="text-xs text-muted-foreground">{tool.desc}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Alert */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-sm">Low Stock Alert</div>
          <p className="text-xs text-muted-foreground mt-0.5">3 products are running low. AI suggests restocking within 2 days to avoid stockouts.</p>
        </div>
      </div>
    </div>
  )
}
