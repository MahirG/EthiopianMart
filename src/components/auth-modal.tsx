'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Phone, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useAppStore } from '@/lib/store'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onSuccess?: () => void
}

export function AuthModal({ open, onClose, mode: initialMode, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        toast.success('Account created! Signing you in... 🎉')
      }

      // Sign in
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Invalid email or password')
      }

      toast.success(mode === 'register' ? 'Welcome to Gulit.shop! 🎉' : 'Welcome back! 👋')

      // Fetch session to determine role and redirect accordingly
      try {
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()
        const role = session?.user?.role

        // Redirect based on role
        if (role === 'ADMIN') {
          useAppStore.getState().setView('admin')
          toast.info('Redirecting to Admin Dashboard...')
        } else if (role === 'VENDOR') {
          useAppStore.getState().setView('vendor')
          toast.info('Redirecting to Vendor Dashboard...')
        } else {
          useAppStore.getState().setView('home')
        }
      } catch {
        // If session fetch fails, just stay on current view
      }

      onSuccess?.()
      onClose()
      setFormData({ name: '', email: '', password: '', phone: '' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (type: 'user' | 'vendor' | 'admin') => {
    const creds = {
      user: { email: 'user@gulit.shop', password: 'user123' },
      vendor: { email: 'vendor@gulit.shop', password: 'vendor123' },
      admin: { email: 'admin@gulit.shop', password: 'admin123' },
    }
    setFormData((f) => ({ ...f, ...creds[type] }))
    setMode('login')
  }

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
              className="relative w-full max-w-md rounded-3xl liquid-glass shadow-elevated overflow-hidden pointer-events-auto max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              {/* Header */}
              <div className="relative gradient-emerald p-6 text-primary-foreground">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors tap-highlight-none"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <span className="font-black font-display">G</span>
                  </div>
                  <span className="font-black text-lg font-display">Gulit.shop</span>
                </div>
                <h2 className="text-2xl font-black font-display tracking-tight">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-sm text-white/85 mt-1">
                  {mode === 'login' ? 'Sign in to continue shopping' : 'Join millions of happy shoppers'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Abebe Bekele"
                        className="w-full rounded-xl bg-accent/50 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary transition-shadow"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-accent/50 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary transition-shadow"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Phone (optional)</label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+251 911 234 567"
                        className="w-full rounded-xl bg-accent/50 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 ring-primary transition-shadow"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full rounded-xl bg-accent/50 pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 ring-primary transition-shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground tap-highlight-none"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-emerald py-3 font-bold text-sm text-primary-foreground shadow-glow disabled:opacity-50 transition-opacity tap-highlight-none"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>

                {/* Mode toggle */}
                <div className="text-center text-sm text-muted-foreground">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-primary font-semibold hover:underline tap-highlight-none"
                  >
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </div>

                {/* Demo credentials */}
                <div className="pt-3 border-t border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 text-center">
                    Demo Accounts (click to fill)
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: 'user' as const, label: 'Shopper' },
                      { type: 'vendor' as const, label: 'Vendor' },
                      { type: 'admin' as const, label: 'Admin' },
                    ].map((d) => (
                      <button
                        key={d.type}
                        type="button"
                        onClick={() => fillDemo(d.type)}
                        className="rounded-lg glass px-2 py-1.5 text-[10px] font-semibold hover:shadow-premium transition-shadow tap-highlight-none"
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
