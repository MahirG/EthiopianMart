'use client'

import { useAppStore } from '@/lib/store'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function FloatingAIButton() {
  const { aiOpen, setAiOpen, view } = useAppStore()

  // Hide on AI view since it's accessible from nav, and when panel is open
  if (view === 'ai' || aiOpen) return null

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => setAiOpen(true)}
      className="fixed bottom-24 lg:bottom-6 right-4 z-30 flex items-center gap-2 rounded-full gradient-emerald px-4 py-3 text-primary-foreground shadow-glow tap-highlight-none"
      aria-label="Open AI assistant"
    >
      <div className="relative">
        <Sparkles className="h-5 w-5" />
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-1 rounded-full border-2 border-primary/40"
        />
      </div>
      <span className="font-bold text-sm hidden sm:inline">Ask AI</span>
    </motion.button>
  )
}
