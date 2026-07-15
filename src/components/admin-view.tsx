'use client'

import { useAppStore } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Store, DollarSign, TrendingUp, Activity, ShoppingCart,
  ArrowUpRight, ArrowDownRight, Star, Package, AlertCircle,
  Shield, Sparkles, MapPin, Eye, Plus, Search, MoreVertical,
  Edit, Trash2, Copy, Archive, Check, X, Loader2, Boxes,
  Crown, Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { ProductFormModal } from './admin-product-form'

interface Product {
  id: string
  name: string
  price: number
  stock: number
  sku: string
  brand: string | null
  isPublished: boolean
  isArchived: boolean
  isFeatured: boolean
  isBestseller: boolean
  categoryIcon: string
  category: { name: string }
  vendor: { name: string } | null
  variants?: unknown[]
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  user: { name: string; email: string }
  items: { name: string; quantity: number; price: number }[]
}

export function AdminView() {
  const { openAuth } = useAppStore()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers'>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'archived' | 'draft'>('all')
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  const isAdmin = status === 'authenticated' && (session?.user as { role?: string })?.role === 'ADMIN'

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

      // Calculate real stats
      const revenue = ordersRes.ok
        ? (await ordersRes.json()).reduce((sum: number, o: Order) => sum + o.total, 0)
        : 0
      setStats({
        totalUsers: 8450, // Would come from a real endpoint
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
      })
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }, [products.length, orders.length])

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin, fetchData])

  // Show login prompt if not admin
  if (status !== 'loading' && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive"
        >
          <Shield className="h-10 w-10" />
        </motion.div>
        <h2 className="text-2xl font-black mb-2 font-display tracking-tight">Admin Access Required</h2>
        <p className="text-muted-foreground mb-6">Sign in with an admin account to access the dashboard</p>
        <button
          onClick={() => openAuth('login')}
          className="rounded-full gradient-emerald px-8 py-3 font-semibold text-primary-foreground shadow-glow tap-highlight-none"
        >
          Sign In as Admin
        </button>
        <p className="text-xs text-muted-foreground mt-4">
          Demo: admin@gulit.shop / admin123
        </p>
      </div>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Product deleted')
      setProducts(products.filter((p) => p.id !== id))
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      })
      if (!res.ok) throw new Error('Failed to duplicate')
      toast.success('Product duplicated (unpublished)')
      fetchData()
    } catch {
      toast.error('Failed to duplicate product')
    }
  }

  const handleQuickAction = async (id: string, action: 'archive' | 'unarchive' | 'publish' | 'unpublish') => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`Product ${action}d`)
      fetchData()
    } catch {
      toast.error('Action failed')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const handleOrderStatusUpdate = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success(`Order marked as ${status.replace('_', ' ').toLowerCase()}`)
      fetchData()
    } catch {
      toast.error('Failed to update order')
    }
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchFilter =
      filterStatus === 'all' ||
      (filterStatus === 'published' && p.isPublished && !p.isArchived) ||
      (filterStatus === 'archived' && p.isArchived) ||
      (filterStatus === 'draft' && !p.isPublished && !p.isArchived)
    return matchSearch && matchFilter
  })

  const statsCards = [
    { icon: DollarSign, label: 'Revenue', value: `${stats.totalRevenue.toLocaleString()} ETB`, change: '+18.4%', up: true, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: ShoppingCart, label: 'Orders', value: stats.totalOrders, change: '+8.2%', up: true, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Package, label: 'Products', value: stats.totalProducts, change: '+12.5%', up: true, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
    { icon: Users, label: 'Customers', value: stats.totalUsers.toLocaleString(), change: '+24.1%', up: true, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-6 text-white shadow-premium">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-orange-500/20 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black font-display tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-white/70">Welcome back, {session?.user?.name}</p>
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
          { id: 'products', label: 'Products', icon: Package },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'customers', label: 'Customers', icon: Users },
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
            {statsCards.map((stat, i) => {
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
                    <span className="text-xl font-black tabular-nums">{stat.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Recent orders */}
          <div className="rounded-2xl glass p-5">
            <h3 className="font-bold mb-3 font-display tracking-tight">Recent Orders</h3>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center gap-3 rounded-xl bg-accent/30 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{order.orderNumber}</div>
                      <div className="text-xs text-muted-foreground">{order.user.name} • {new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{order.total.toLocaleString()} ETB</div>
                      <span className={`text-[10px] font-bold ${order.status === 'DELIVERED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low stock alerts */}
          <div className="rounded-2xl glass p-5">
            <h3 className="font-bold mb-3 font-display tracking-tight flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Low Stock Alerts
            </h3>
            <div className="space-y-2">
              {products.filter((p) => p.stock <= 5 && !p.isArchived).slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-amber-500/5 border-l-4 border-amber-500 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-lg">
                    {p.categoryIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">SKU: {p.sku}</div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.stock === 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
              {products.filter((p) => p.stock <= 5 && !p.isArchived).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">All products are well-stocked ✓</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, SKU, or brand..."
                className="input-premium pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="input-premium w-auto"
              >
                <option value="all">All Products</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-1.5 rounded-xl gradient-emerald px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow tap-highlight-none whitespace-nowrap"
              >
                <Plus className="h-4 w-4" /> Add Product
              </button>
            </div>
          </div>

          {/* Products list */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center">
              <Boxes className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-bold mb-1">No products found</h3>
              <p className="text-sm text-muted-foreground mb-4">Add your first product to get started</p>
              <button
                onClick={handleAddNew}
                className="rounded-xl gradient-emerald px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow tap-highlight-none"
              >
                <Plus className="h-4 w-4 inline mr-1" /> Add Product
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl glass p-3 flex items-center gap-3"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-2xl">
                    {product.categoryIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                      {product.isFeatured && <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />}
                      {product.isBestseller && <Crown className="h-3 w-3 text-amber-500 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{product.sku}</span>
                      {product.brand && <><span>•</span><span>{product.brand}</span></>}
                      <span>•</span>
                      <span>{product.category.name}</span>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end shrink-0">
                    <div className="font-bold text-sm">{product.price.toLocaleString()} ETB</div>
                    <div className={`text-xs font-medium ${product.stock <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                      Stock: {product.stock}
                    </div>
                  </div>
                  {/* Status badge */}
                  <div className="shrink-0">
                    {product.isArchived ? (
                      <span className="rounded-full bg-slate-500/15 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">Archived</span>
                    ) : product.isPublished ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Published</span>
                    ) : (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">Draft</span>
                    )}
                  </div>
                  {/* Actions dropdown */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === product.id ? null : product.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg glass hover:shadow-premium tap-highlight-none"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <AnimatePresence>
                      {actionMenuId === product.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActionMenuId(null)} />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-1 z-20 w-44 rounded-xl glass-strong shadow-elevated overflow-hidden py-1"
                          >
                            <button
                              onClick={() => { handleEdit(product); setActionMenuId(null) }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                            >
                              <Edit className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => { handleDuplicate(product.id); setActionMenuId(null) }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                            >
                              <Copy className="h-3.5 w-3.5" /> Duplicate
                            </button>
                            {product.isPublished ? (
                              <button
                                onClick={() => { handleQuickAction(product.id, 'unpublish'); setActionMenuId(null) }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                              >
                                <Eye className="h-3.5 w-3.5" /> Unpublish
                              </button>
                            ) : (
                              <button
                                onClick={() => { handleQuickAction(product.id, 'publish'); setActionMenuId(null) }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                              >
                                <Check className="h-3.5 w-3.5" /> Publish
                              </button>
                            )}
                            {product.isArchived ? (
                              <button
                                onClick={() => { handleQuickAction(product.id, 'unarchive'); setActionMenuId(null) }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                              >
                                <Archive className="h-3.5 w-3.5" /> Unarchive
                              </button>
                            ) : (
                              <button
                                onClick={() => { handleQuickAction(product.id, 'archive'); setActionMenuId(null) }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors tap-highlight-none text-left"
                              >
                                <Archive className="h-3.5 w-3.5" /> Archive
                              </button>
                            )}
                            <div className="h-px bg-border/40 my-1" />
                            <button
                              onClick={() => { handleDelete(product.id); setActionMenuId(null) }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-destructive/10 text-destructive transition-colors tap-highlight-none text-left"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders management */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="rounded-2xl glass p-12 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-bold mb-1">No orders yet</h3>
              <p className="text-sm text-muted-foreground">Orders will appear here when customers buy</p>
            </div>
          ) : (
            orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl glass p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm">{order.orderNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.user.name} • {order.user.email} • {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black">{order.total.toLocaleString()} ETB</div>
                    <span className={`text-xs font-bold ${
                      order.status === 'DELIVERED' ? 'text-emerald-600 dark:text-emerald-400' :
                      order.status === 'CANCELLED' ? 'text-rose-600 dark:text-rose-400' :
                      'text-amber-600 dark:text-amber-400'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.quantity}× {item.name}
                      {i < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                {/* Status actions */}
                <div className="flex flex-wrap gap-2">
                  {order.status === 'PLACED' && (
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'CONFIRMED')} className="rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 text-xs font-bold tap-highlight-none">
                      Accept Order
                    </button>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'PACKING')} className="rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 text-xs font-bold tap-highlight-none">
                      Start Packing
                    </button>
                  )}
                  {order.status === 'PACKING' && (
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'ON_THE_WAY')} className="rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 px-3 py-1.5 text-xs font-bold tap-highlight-none">
                      Mark Shipped
                    </button>
                  )}
                  {order.status === 'ON_THE_WAY' && (
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'DELIVERED')} className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 text-xs font-bold tap-highlight-none">
                      Mark Delivered
                    </button>
                  )}
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <button onClick={() => handleOrderStatusUpdate(order.id, 'CANCELLED')} className="rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 text-xs font-bold tap-highlight-none">
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Customers */}
      {activeTab === 'customers' && (
        <div className="rounded-2xl glass p-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-bold mb-1">Customer Management</h3>
          <p className="text-sm text-muted-foreground">Total customers: {stats.totalUsers.toLocaleString()}</p>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editingProduct}
        onSaved={fetchData}
      />
    </div>
  )
}
