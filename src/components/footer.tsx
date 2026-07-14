'use client'

import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  Sparkles, Truck, Shield, Headphones, CreditCard, Award,
  Facebook, Twitter, Instagram, Youtube, Send, ArrowRight,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const footerLinks = {
  Shop: ['All Products', 'Today\'s Deals', 'Best Sellers', 'New Arrivals', 'Gift Cards'],
  Account: ['My Orders', 'Wishlist', 'Addresses', 'Membership', 'Wallet'],
  Sell: ['Become a Vendor', 'Vendor Dashboard', 'Seller AI Tools', 'Pricing', 'Success Stories'],
  Help: ['Help Center', 'Track Order', 'Returns & Refunds', 'Contact Us', 'FAQs'],
  Company: ['About Gulit.shop', 'Careers', 'Press', 'Blog', 'Sustainability'],
}

const socialIcons = [Facebook, Twitter, Instagram, Youtube]

export function Footer() {
  const { setView } = useAppStore()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    toast.success('Subscribed successfully! 🎉', {
      description: 'You\'ll receive exclusive deals and offers in your inbox.',
    })
    setEmail('')
  }

  return (
    <footer className="mt-12 border-t border-border/40">
      {/* Trust bar */}
      <div className="border-b border-border/40 glass">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders over 500 ETB' },
              { icon: Shield, title: 'Secure Payments', desc: 'PCI DSS compliant' },
              { icon: Headphones, title: '24/7 Support', desc: 'AI + human help' },
              { icon: Award, title: 'Verified Vendors', desc: 'Trusted local sellers' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="relative overflow-hidden gradient-emerald">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wide">Newsletter</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2 font-display tracking-tight text-balance">
                Get exclusive deals & early access
              </h2>
              <p className="text-white/90 text-sm">
                Join 2.4M+ Ethiopians saving money with Gulit.shop. Receive personalized offers, flash sale alerts, and AI-powered shopping tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                aria-label="Email address"
                className="flex-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none focus:ring-2 ring-white/50 transition-shadow"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-sm text-primary shadow-lg tap-highlight-none whitespace-nowrap"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground mr-2">We Accept:</span>
            {['Telebirr', 'CBE Birr', 'Chapa', 'SantimPay', 'Visa', 'Mastercard', 'COD'].map((pm) => (
              <span key={pm} className="rounded-lg glass px-3 py-1.5 text-xs font-bold">
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <button onClick={() => setView('home')} className="flex items-center gap-2 mb-4 tap-highlight-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-ethiopian text-white shadow-glow">
                <span className="text-lg font-black font-display">G</span>
              </div>
              <div>
                <div className="text-lg font-black font-display tracking-tight text-gradient-emerald">Gulit.shop</div>
                <div className="text-[10px] text-muted-foreground">Africa's Trusted Shopping Platform</div>
              </div>
            </button>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs leading-relaxed">
              Africa&apos;s trusted online shopping destination. Shop millions of products, compare prices, save money with AI, and pay your way — simple, fast, and enjoyable.
            </p>
            <div className="flex gap-2">
              {socialIcons.map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg glass hover:shadow-premium transition-all tap-highlight-none"
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-sm mb-3 font-display tracking-tight">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (link === 'Become a Vendor') setView('vendor')
                        else if (link === 'My Orders') setView('orders')
                        else if (link === 'Wishlist') setView('profile')
                        else toast.info(`${link} page`)
                      }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors tap-highlight-none"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar with HisabTech branding */}
      <div className="border-t border-border/40 glass">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              © 2026 Gulit.shop. All rights reserved. •{' '}
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              {' • '}
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              {' • '}
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>

            {/* Powered by HisabTech */}
            <a
              href="https://hisabtechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-semibold hover:shadow-glow transition-all tap-highlight-none group"
              aria-label="Visit HisabTech — powered by"
            >
              <span className="text-muted-foreground">Powered by</span>
              <span className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md gradient-emerald text-primary-foreground font-black text-[10px] font-display">
                  H
                </span>
                <span className="text-gradient-emerald font-bold">HisabTech</span>
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
