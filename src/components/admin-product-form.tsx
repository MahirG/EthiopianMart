'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Plus, Trash2, Image as ImageIcon, Package, DollarSign,
  Settings, Tag, Save, Loader2, ChevronDown, ChevronRight,
  Copy, Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  product?: Record<string, unknown> | null
  onSaved?: () => void
}

interface Variant {
  id?: string
  name: string
  value: string
  sku?: string
  price?: number
  stock?: number
  image?: string
}

interface Spec {
  label: string
  value: string
}

export function ProductFormModal({ open, onClose, product, onSaved }: ProductFormModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'inventory' | 'variants' | 'media' | 'seo'>('basic')
  const [loading, setLoading] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([])
  const [specs, setSpecs] = useState<Spec[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [catalogCategories, setCatalogCategories] = useState<Array<{ id: string; name: string }>>([])

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    costPrice: '',
    wholesalePrice: '',
    salePrice: '',
    sku: '',
    barcode: '',
    brand: '',
    manufacturer: '',
    countryOfOrigin: '',
    stock: '0',
    unlimitedStock: false,
    lowStockThreshold: '5',
    warehouseLocation: '',
    categoryIcon: '📦',
    categoryId: '',
    deliveryDays: '3',
    isLocal: false,
    isOrganic: false,
    isHandmade: false,
    isFeatured: false,
    isBestseller: false,
    isPublished: true,
    weight: '',
    dimensions: '',
    warranty: '',
    seoTitle: '',
    seoDescription: '',
  })

  const isEdit = !!product

  // Load product data when editing
  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
    if (cancelled) return
    if (product) {
      setFormData({
        name: (product.name as string) || '',
        description: (product.description as string) || '',
        shortDescription: (product.shortDescription as string) || '',
        price: (product.price as string) || '',
        originalPrice: (product.originalPrice as string) || '',
        costPrice: (product.costPrice as string) || '',
        wholesalePrice: (product.wholesalePrice as string) || '',
        salePrice: (product.salePrice as string) || '',
        sku: (product.sku as string) || '',
        barcode: (product.barcode as string) || '',
        brand: (product.brand as string) || '',
        manufacturer: (product.manufacturer as string) || '',
        countryOfOrigin: (product.countryOfOrigin as string) || '',
        stock: String(product.stock || 0),
        unlimitedStock: (product.unlimitedStock as boolean) || false,
        lowStockThreshold: String(product.lowStockThreshold || 5),
        warehouseLocation: (product.warehouseLocation as string) || '',
        categoryIcon: (product.categoryIcon as string) || '📦',
        categoryId: (product.categoryId as string) || '',
        deliveryDays: String(product.deliveryDays || 3),
        isLocal: (product.isLocal as boolean) || false,
        isOrganic: (product.isOrganic as boolean) || false,
        isHandmade: (product.isHandmade as boolean) || false,
        isFeatured: (product.isFeatured as boolean) || false,
        isBestseller: (product.isBestseller as boolean) || false,
        isPublished: product.isPublished !== false,
        weight: (product.weight as string) || '',
        dimensions: (product.dimensions as string) || '',
        warranty: (product.warranty as string) || '',
        seoTitle: (product.seoTitle as string) || '',
        seoDescription: (product.seoDescription as string) || '',
      })
      // Parse variants
      try {
        const v = (product.variants as Variant[]) || []
        setVariants(v)
      } catch { setVariants([]) }
      // Parse specs
      try {
        const s = JSON.parse((product.specs as string) || '[]')
        setSpecs(s)
      } catch { setSpecs([]) }
      // Parse tags
      try {
        const t = JSON.parse((product.tags as string) || '[]')
        setTags(t)
      } catch { setTags([]) }
    } else {
      // Reset form for new product
      setFormData({
        name: '', description: '', shortDescription: '', price: '', originalPrice: '',
        costPrice: '', wholesalePrice: '', salePrice: '', sku: '', barcode: '',
        brand: '', manufacturer: '', countryOfOrigin: '', stock: '0', unlimitedStock: false,
        lowStockThreshold: '5', warehouseLocation: '', categoryIcon: '📦',
        categoryId: '', deliveryDays: '3', isLocal: false, isOrganic: false,
        isHandmade: false, isFeatured: false, isBestseller: false, isPublished: true,
        weight: '', dimensions: '', warranty: '', seoTitle: '', seoDescription: '',
      })
      setVariants([])
      setSpecs([])
      setTags([])
    }
    })
    return () => { cancelled = true }
  }, [product])

  useEffect(() => {
    if (!open) return
    fetch('/api/categories')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Failed to load categories')))
      .then((data) => setCatalogCategories(data))
      .catch(() => toast.error('Categories could not be loaded'))
  }, [open])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', value: '', sku: '', price: 0, stock: 0 }])
  }

  const handleAddSpec = () => {
    setSpecs([...specs, { label: '', value: '' }])
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.categoryId) {
      toast.error('Please fill in all required fields (Name, Description, Price, Category)')
      setActiveTab('basic')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice || null,
        costPrice: formData.costPrice || null,
        wholesalePrice: formData.wholesalePrice || null,
        salePrice: formData.salePrice || null,
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        deliveryDays: parseInt(formData.deliveryDays),
        tags,
        specs,
        variants: variants.filter((v) => v.name && v.value),
      }

      const url = isEdit ? `/api/products/${product?.id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product')
      }

      toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!')
      onSaved?.()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info', icon: Package },
    { id: 'pricing' as const, label: 'Pricing', icon: DollarSign },
    { id: 'inventory' as const, label: 'Inventory', icon: Settings },
    { id: 'variants' as const, label: 'Variants', icon: Tag },
    { id: 'media' as const, label: 'Media & Specs', icon: ImageIcon },
    { id: 'seo' as const, label: 'SEO', icon: Tag },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full max-w-3xl rounded-3xl liquid-glass shadow-elevated overflow-hidden pointer-events-auto max-h-[92vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/40 gradient-emerald text-primary-foreground shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg font-display tracking-tight">
                      {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-xs text-white/80">
                      {isEdit ? 'Update product information' : 'Create a new product for your store'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors tap-highlight-none"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-3 border-b border-border/40 overflow-x-auto scrollbar-hide shrink-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors tap-highlight-none ${
                        active ? 'gradient-emerald text-primary-foreground shadow-glow' : 'glass hover:shadow-premium'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <Field label="Product Name *">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Samsung Galaxy A15"
                        className="input-premium"
                      />
                    </Field>

                    <Field label="Short Description">
                      <input
                        type="text"
                        value={formData.shortDescription}
                        onChange={(e) => handleChange('shortDescription', e.target.value)}
                        placeholder="One-line summary for product cards"
                        className="input-premium"
                      />
                    </Field>

                    <Field label="Full Description *">
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Detailed product description..."
                        rows={4}
                        className="input-premium resize-none"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Category *">
                        <select
                          value={formData.categoryId}
                          onChange={(e) => handleChange('categoryId', e.target.value)}
                          className="input-premium"
                        >
                          <option value="">Select category</option>
                          {catalogCategories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Category Icon">
                        <input
                          type="text"
                          value={formData.categoryIcon}
                          onChange={(e) => handleChange('categoryIcon', e.target.value)}
                          placeholder="📦"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Brand">
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => handleChange('brand', e.target.value)}
                          placeholder="e.g. Samsung"
                          className="input-premium"
                        />
                      </Field>
                      <Field label="Manufacturer">
                        <input
                          type="text"
                          value={formData.manufacturer}
                          onChange={(e) => handleChange('manufacturer', e.target.value)}
                          placeholder="e.g. Samsung Electronics"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Country of Origin">
                        <input
                          type="text"
                          value={formData.countryOfOrigin}
                          onChange={(e) => handleChange('countryOfOrigin', e.target.value)}
                          placeholder="e.g. Ethiopia"
                          className="input-premium"
                        />
                      </Field>
                      <Field label="Warranty">
                        <input
                          type="text"
                          value={formData.warranty}
                          onChange={(e) => handleChange('warranty', e.target.value)}
                          placeholder="e.g. 1 Year"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    <Field label="Tags">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag() } }}
                          placeholder="Add tag and press Enter"
                          className="input-premium flex-1"
                        />
                        <button
                          onClick={handleAddTag}
                          className="rounded-xl glass px-3 font-semibold text-sm hover:shadow-premium tap-highlight-none"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {tags.map((tag) => (
                            <span key={tag} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              {tag}
                              <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="tap-highlight-none">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </Field>

                    {/* Flags */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { key: 'isLocal', label: '🇪🇹 Local Product' },
                        { key: 'isOrganic', label: '🌿 Organic' },
                        { key: 'isHandmade', label: '✋ Handmade' },
                        { key: 'isFeatured', label: '⭐ Featured' },
                        { key: 'isBestseller', label: '🏆 Bestseller' },
                        { key: 'isPublished', label: '👁️ Published' },
                      ].map((flag) => (
                        <label key={flag.key} className="flex items-center gap-2 rounded-xl glass p-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[flag.key as keyof typeof formData] as boolean}
                            onChange={(e) => handleChange(flag.key, e.target.checked)}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-xs font-medium">{flag.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'pricing' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Regular Price (ETB) *">
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleChange('price', e.target.value)}
                          placeholder="850"
                          className="input-premium"
                        />
                      </Field>
                      <Field label="Original Price (ETB)">
                        <input
                          type="number"
                          value={formData.originalPrice}
                          onChange={(e) => handleChange('originalPrice', e.target.value)}
                          placeholder="1100"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Cost Price (ETB)">
                        <input
                          type="number"
                          value={formData.costPrice}
                          onChange={(e) => handleChange('costPrice', e.target.value)}
                          placeholder="Internal cost"
                          className="input-premium"
                        />
                      </Field>
                      <Field label="Sale Price (ETB)">
                        <input
                          type="number"
                          value={formData.salePrice}
                          onChange={(e) => handleChange('salePrice', e.target.value)}
                          placeholder="Flash sale price"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Wholesale Price (ETB)">
                        <input
                          type="number"
                          value={formData.wholesalePrice}
                          onChange={(e) => handleChange('wholesalePrice', e.target.value)}
                          placeholder="Bulk price"
                          className="input-premium"
                        />
                      </Field>
                      <Field label="Delivery Days">
                        <input
                          type="number"
                          value={formData.deliveryDays}
                          onChange={(e) => handleChange('deliveryDays', e.target.value)}
                          placeholder="3"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    {/* Discount calculator */}
                    {formData.price && formData.originalPrice && (
                      <div className="rounded-xl gradient-emerald p-4 text-primary-foreground">
                        <div className="text-sm font-bold mb-1">Auto-Calculated Discount</div>
                        <div className="text-2xl font-black">
                          {Math.round((1 - parseFloat(formData.price) / parseFloat(formData.originalPrice)) * 100)}% OFF
                        </div>
                        <div className="text-xs text-white/80">
                          Save {(parseFloat(formData.originalPrice) - parseFloat(formData.price)).toLocaleString()} ETB
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'inventory' && (
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 rounded-xl glass p-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.unlimitedStock}
                        onChange={(e) => handleChange('unlimitedStock', e.target.checked)}
                        className="h-4 w-4 accent-primary"
                      />
                      <div>
                        <div className="font-semibold text-sm">Unlimited Stock</div>
                        <div className="text-xs text-muted-foreground">Product is always in stock (digital goods, etc.)</div>
                      </div>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Stock Quantity">
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => handleChange('stock', e.target.value)}
                          placeholder="100"
                          disabled={formData.unlimitedStock}
                          className="input-premium disabled:opacity-50"
                        />
                      </Field>
                      <Field label="Low Stock Alert Threshold">
                        <input
                          type="number"
                          value={formData.lowStockThreshold}
                          onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
                          placeholder="5"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="SKU *">
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => handleChange('sku', e.target.value)}
                          placeholder="Auto-generated if empty"
                          className="input-premium"
                        />
                      </Field>
                      <Field label="Barcode">
                        <input
                          type="text"
                          value={formData.barcode}
                          onChange={(e) => handleChange('barcode', e.target.value)}
                          placeholder="EAN/UPC code"
                          className="input-premium"
                        />
                      </Field>
                    </div>

                    <Field label="Warehouse Location">
                      <input
                        type="text"
                        value={formData.warehouseLocation}
                        onChange={(e) => handleChange('warehouseLocation', e.target.value)}
                        placeholder="e.g. Addis Ababa - Bole Warehouse"
                        className="input-premium"
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Weight">
                        <input
                          type="text"
                          value={formData.weight}
                          onChange={(e) => handleChange('weight', e.target.value)}
                          placeholder="e.g. 1.5 kg"
                          className="input-premium"
                        />
                      </Field>
                      <Field label="Dimensions">
                        <input
                          type="text"
                          value={formData.dimensions}
                          onChange={(e) => handleChange('dimensions', e.target.value)}
                          placeholder="e.g. 20×15×5 cm"
                          className="input-premium"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {activeTab === 'variants' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm">Product Variants</h3>
                        <p className="text-xs text-muted-foreground">Add color, size, storage, etc. with own price and stock</p>
                      </div>
                      <button
                        onClick={handleAddVariant}
                        className="flex items-center gap-1.5 rounded-xl gradient-emerald px-3 py-2 text-xs font-bold text-primary-foreground shadow-glow tap-highlight-none"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Variant
                      </button>
                    </div>

                    {variants.length === 0 ? (
                      <div className="rounded-2xl glass p-8 text-center">
                        <Tag className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-semibold">No variants yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Products without variants use the default price and stock</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {variants.map((variant, idx) => (
                          <div key={idx} className="rounded-2xl glass p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">Variant {idx + 1}</span>
                              <button
                                onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                                className="text-destructive hover:bg-destructive/10 p-1 rounded-lg tap-highlight-none"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => {
                                  const updated = [...variants]
                                  updated[idx] = { ...variant, name: e.target.value }
                                  setVariants(updated)
                                }}
                                placeholder="Name (e.g. Color)"
                                className="input-premium text-xs"
                              />
                              <input
                                type="text"
                                value={variant.value}
                                onChange={(e) => {
                                  const updated = [...variants]
                                  updated[idx] = { ...variant, value: e.target.value }
                                  setVariants(updated)
                                }}
                                placeholder="Value (e.g. Red)"
                                className="input-premium text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={variant.sku || ''}
                                onChange={(e) => {
                                  const updated = [...variants]
                                  updated[idx] = { ...variant, sku: e.target.value }
                                  setVariants(updated)
                                }}
                                placeholder="SKU"
                                className="input-premium text-xs"
                              />
                              <input
                                type="number"
                                value={variant.price || 0}
                                onChange={(e) => {
                                  const updated = [...variants]
                                  updated[idx] = { ...variant, price: parseFloat(e.target.value) || 0 }
                                  setVariants(updated)
                                }}
                                placeholder="Price"
                                className="input-premium text-xs"
                              />
                              <input
                                type="number"
                                value={variant.stock || 0}
                                onChange={(e) => {
                                  const updated = [...variants]
                                  updated[idx] = { ...variant, stock: parseInt(e.target.value) || 0 }
                                  setVariants(updated)
                                }}
                                placeholder="Stock"
                                className="input-premium text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-4">
                    <Field label="Product Images (emoji or URL, comma-separated)">
                      <input
                        type="text"
                        value={formData.categoryIcon}
                        onChange={(e) => handleChange('categoryIcon', e.target.value)}
                        placeholder="📦"
                        className="input-premium"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        In production, this would be a drag-and-drop image uploader with optimization
                      </p>
                    </Field>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-sm">Specifications</h3>
                        <button
                          onClick={handleAddSpec}
                          className="flex items-center gap-1 rounded-lg glass px-2.5 py-1 text-xs font-semibold hover:shadow-premium tap-highlight-none"
                        >
                          <Plus className="h-3 w-3" /> Add Spec
                        </button>
                      </div>
                      {specs.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">No specifications added</p>
                      ) : (
                        <div className="space-y-2">
                          {specs.map((spec, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={spec.label}
                                onChange={(e) => {
                                  const updated = [...specs]
                                  updated[idx] = { ...spec, label: e.target.value }
                                  setSpecs(updated)
                                }}
                                placeholder="Label (e.g. Weight)"
                                className="input-premium text-xs flex-1"
                              />
                              <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => {
                                  const updated = [...specs]
                                  updated[idx] = { ...spec, value: e.target.value }
                                  setSpecs(updated)
                                }}
                                placeholder="Value (e.g. 1 kg)"
                                className="input-premium text-xs flex-1"
                              />
                              <button
                                onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg tap-highlight-none"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-4">
                    <Field label="SEO Title">
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => handleChange('seoTitle', e.target.value)}
                        placeholder="Custom title for search engines"
                        className="input-premium"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(formData.seoTitle || formData.name).length}/60 characters
                      </p>
                    </Field>

                    <Field label="SEO Description">
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) => handleChange('seoDescription', e.target.value)}
                        placeholder="Meta description for search results"
                        rows={3}
                        className="input-premium resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {(formData.seoDescription || formData.shortDescription).length}/160 characters
                      </p>
                    </Field>

                    <div className="rounded-xl glass p-4">
                      <h4 className="font-bold text-sm mb-2">Search Preview</h4>
                      <div className="bg-background rounded-lg p-3">
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-0.5">ethiopianmart.local</div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1 truncate">
                          {formData.seoTitle || formData.name || 'Product Title'}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {formData.seoDescription || formData.shortDescription || formData.description || 'Product description will appear here...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-2 p-4 border-t border-border/40 shrink-0">
                <button
                  onClick={onClose}
                  className="rounded-xl glass px-5 py-2.5 font-semibold text-sm hover:shadow-premium tap-highlight-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl gradient-emerald px-5 py-2.5 font-bold text-sm text-primary-foreground shadow-glow disabled:opacity-50 tap-highlight-none"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4" /> {isEdit ? 'Update Product' : 'Create Product'}</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  )
}
