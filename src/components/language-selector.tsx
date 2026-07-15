'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { languages } from '@/lib/i18n'
import { Check, Globe, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function LanguageSelector() {
  const { language, setLanguage } = useAppStore()
  const [open, setOpen] = useState(false)
  const current = languages.find((l) => l.code === language) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-sm font-medium tap-highlight-none hover:shadow-premium transition-all"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">{current.nativeName}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl glass-strong shadow-premium"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Select Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent ${
                      language === lang.code ? 'bg-accent/50 font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {lang.flag}
                      </span>
                      <div>
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs text-muted-foreground">{lang.name}</div>
                      </div>
                    </div>
                    {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
