'use client'

import { useRef, useCallback, useState, type ReactNode, type MouseEvent } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ============================================================
   2026 PREMIUM UI PRIMITIVES
   RippleButton, GlassCard, Skeleton — unified design language
   ============================================================ */

/* ---- Ripple Button ----
   Premium tactile feedback with material-style ripple.
   Honors reduced-motion automatically. */

interface RippleButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  rippleColor?: string
  variant?: 'default' | 'primary' | 'gold'
}

export function RippleButton({
  children,
  className,
  rippleColor,
  variant = 'default',
  onClick,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; size: number; id: number }[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const id = Date.now()
    setRipples((prev) => [...prev, { x, y, size, id }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
    onClick?.(e)
  }, [onClick])

  const variantClass = {
    default: '',
    primary: 'gradient-emerald text-primary-foreground shadow-glow',
    gold: 'gradient-gold text-white shadow-glow-gold',
  }[variant]

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden tap-highlight-none',
        variantClass,
        className
      )}
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple-circle"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            background: rippleColor || (variant !== 'default' ? 'oklch(1 0 0 / 0.4)' : 'oklch(0.48 0.14 168 / 0.25)'),
          }}
        />
      ))}
    </motion.button>
  )
}

/* ---- Glass Card ----
   Premium card with liquid glass surface and optional hover lift. */

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'glass' | 'glass-strong' | 'liquid-glass'
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  variant = 'glass',
  hover = false,
  onClick,
}: GlassCardProps) {
  const variantClass = {
    'glass': 'glass',
    'glass-strong': 'glass-strong',
    'liquid-glass': 'liquid-glass',
  }[variant]

  return (
    <motion.div
      onClick={onClick}
      className={cn(variantClass, 'rounded-2xl', hover && 'cursor-pointer transition-all duration-300', className)}
      whileHover={hover ? { y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } } : undefined}
    >
      {children}
    </motion.div>
  )
}

/* ---- Skeleton ----
   Premium shimmer placeholder for loading states. */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton-premium rounded-lg', className)} aria-hidden="true" />
}

/* ---- Skeleton Product Card ---- */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl glass p-3 space-y-3">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
    </div>
  )
}

/* ---- Animated Number ----
   Counts up to a value with spring physics. */

interface AnimatedNumberProps {
  value: number
  format?: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)

  // Simple animation — framer's useSpring would require more wiring
  // but this is lightweight and works for our use case
  useState(() => {
    const duration = 800
    const start = Date.now()
    const initial = 0
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(initial + (value - initial) * eased)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
    return value
  })

  return (
    <span className={className}>
      {format ? format(display) : Math.round(display).toLocaleString()}
    </span>
  )
}
