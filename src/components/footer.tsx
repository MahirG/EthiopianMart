'use client'

import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import {
  Sparkles, Truck, Shield, Headphones, Award,
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  Send, ArrowRight, MapPin, Phone, Mail, Clock, Lock,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { LanguageSelector } from './language-selector'

const footerColumns = [
  {
    title: 'Company',
    links: [
      'About Us', 'Our Story', 'Careers', 'Press',
      'Investor Relations', 'Affiliate Program', 'Gift Cards', 'Blog', 'News',
    ],
  },
  {
    title: 'Customer Service',
    links: [
      'Help Center', 'Contact Support', 'Shipping Information',
      'Returns & Refunds', 'Order Tracking', 'Payment Methods', 'FAQs', 'Report a Problem',
    ],
  },
  {
    title: 'Legal',
    links: [
      'Privacy Policy', 'Terms & Conditions', 'Cookie Policy',
      'Refund Policy', 'Warranty', 'Accessibility', 'Security',
    ],
  },
  {
    title: 'Shopping',
    links: [
      "Today's Deals", 'New Arrivals', 'Top Rated',
      'Best Sellers', 'Clearance', 'Coupons', 'Featured Brands',
    ],
  },
]

const socialIcons = [Facebook, Twitter, Instagram, Youtube, Linkedin]

const paymentMethods = ['Telebirr', 'CBE Birr', 'Chapa', 'SantimPay', 'Visa', 'Mastercard', 'COD']

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

  const handleLinkClick = (link: string) => {
    if (link === 'Order Tracking') setView('orders')
    else if (link === "Today's Deals" || link === 'New Arrivals' || link === 'Best Sellers' || link === 'Top Rated' || link === 'Clearance' || link === 'Featured Brands' || link === 'Coupons') setView('search')
    else if (link === 'Help Center' || link === 'Contact Support' || link === 'Report a Problem' || link === 'FAQs') toast.info(`${link} — support page`)
    else toast.info(`${link} page`)
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
                Get exclusive deals &amp; early access
              </h2>
              <p className="text-white/90 text-sm">
                Join millions of shoppers saving money with Gulit.shop. Receive personalized offers, flash sale alerts, and AI-powered shopping tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
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
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-sm text-primary shadow-lg tap-highlight-none whitespace-nowrap"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer — 5 columns */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Column 1: Brand + Company */}
          <div className="col-span-2 lg:col-span-1">
            <button onClick={() => setView('home')} className="flex items-center gap-2 mb-4 tap-highlight-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-ethiopian text-white shadow-glow">
                <span className="text-lg font-black font-display">G</span>
              </div>
              <div>
                <div className="text-lg font-black font-display tracking-tight text-gradient-emerald">Gulit.shop</div>
                <div className="text-[10px] text-muted-foreground">Africa's Trusted Shopping Platform</div>
              </div>
            </button>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Africa&apos;s trusted online shopping destination. Shop millions of products with confidence.
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

          {/* Columns 2-5: Link groups */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-bold text-sm mb-3 font-display tracking-tight">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors tap-highlight-none text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 6: Contact info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="font-bold text-sm mb-3 font-display tracking-tight">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Bole Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+251111234567" className="hover:text-primary transition-colors">+251 11 123 4567</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:hello@gulit.shop" className="hover:text-primary transition-colors">hello@gulit.shop</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div>Mon - Fri: 8:00 AM - 8:00 PM</div>
                  <div>Sat - Sun: 9:00 AM - 6:00 PM</div>
                </div>
              </li>
            </ul>
            {/* Mini map placeholder */}
            <a
              href="https://maps.google.com/?q=Bole+Addis+Ababa"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-xl overflow-hidden glass h-20 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute bottom-1 left-2 text-[10px] font-bold text-foreground bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded">
                View on Map
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40 glass">
        <div className="mx-auto max-w-7xl px-4 py-5">
          {/* Payment methods + SSL */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4 pb-4 border-b border-border/30">
            <span className="text-xs font-semibold text-muted-foreground mr-2">We Accept:</span>
            {paymentMethods.map((pm) => (
              <span key={pm} className="rounded-lg glass px-3 py-1.5 text-xs font-bold">
                {pm}
              </span>
            ))}
            <span className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">
              <Lock className="h-3 w-3" /> SSL Secure
            </span>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-xs text-muted-foreground text-center md:text-left order-3 md:order-1">
              © 2026 Gulit.shop. All Rights Reserved. •{' '}
              <button onClick={() => toast.info('Privacy Policy')} className="hover:text-primary transition-colors">Privacy</button>
              {' • '}
              <button onClick={() => toast.info('Terms & Conditions')} className="hover:text-primary transition-colors">Terms</button>
              {' • '}
              <button onClick={() => toast.info('Cookie Policy')} className="hover:text-primary transition-colors">Cookies</button>
            </div>

            {/* Language + Currency */}
            <div className="flex items-center gap-3 order-2 md:order-2">
              <LanguageSelector />
              <select
                className="rounded-lg glass px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 ring-primary cursor-pointer"
                aria-label="Select currency"
                defaultValue="ETB"
              >
                <option value="ETB">ETB ₼</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
              </select>
            </div>

            {/* Powered by HisabTech */}
            <a
              href="https://hisabtechnologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full glass-strong px-4 py-2 text-xs font-semibold hover:shadow-glow transition-all tap-highlight-none group order-1 md:order-3"
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
