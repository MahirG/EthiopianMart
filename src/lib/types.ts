// Core types for the Ethiopian Shopping Super App

export type Language = 'en' | 'am' | 'or' | 'ti' | 'so'

export type View =
  | 'home'
  | 'search'
  | 'cart'
  | 'orders'
  | 'profile'
  | 'vendor'
  | 'admin'
  | 'product'

export interface Product {
  id: string
  name: string
  nameAm?: string
  category: string
  categoryIcon: string
  price: number // in ETB
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  vendor: string
  vendorId: string
  location: string
  inStock: boolean
  deliveryDays: number
  isLocal?: boolean
  isOrganic?: boolean
  isHandmade?: boolean
  tags?: string[]
  discount?: number
  bundleSavings?: number
  predictedPriceDrop?: number
  bestTimeToBuy?: string
  description: string
}

export interface Category {
  id: string
  name: string
  nameAm?: string
  icon: string
  color: string
  productCount: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  date: string
  status: 'placed' | 'confirmed' | 'packing' | 'on_the_way' | 'delivered'
  items: { name: string; quantity: number; price: number; image: string }[]
  total: number
  vendor: string
  driver?: { name: string; phone: string; rating: number; vehicle: string }
  eta?: string
  progress: number
  deliveryAddress: string
  paymentMethod: string
}

export interface PaymentMethod {
  id: string
  name: string
  type: 'mobile' | 'bank' | 'card' | 'cash' | 'wallet'
  icon: string
  color: string
  description: string
  balance?: number
}

export interface Notification {
  id: string
  type: 'price_drop' | 'order' | 'flash_sale' | 'new_arrival' | 'wishlist' | 'payment' | 'delivery' | 'savings'
  title: string
  message: string
  time: string
  read: boolean
  icon: string
}

export interface Vendor {
  id: string
  name: string
  rating: number
  productCount: number
  sales: number
  revenue: number
  location: string
  verified: boolean
}

export interface MembershipTier {
  name: string
  price: number
  color: string
  benefits: string[]
  popular?: boolean
}
