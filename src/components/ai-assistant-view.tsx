'use client'

import { useAppStore } from '@/lib/store'
import { aiQuickPrompts } from '@/lib/data'
import { motion } from 'framer-motion'
import {
  Sparkles, Mic, Camera, ScanLine, Calculator, Send, TrendingDown,
  ShoppingBag, Heart, Package, Wallet, MapPin,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function AIAssistantView() {
  const { chatMessages, sendMessage } = useAppStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSend = (text?: string) => {
    const msg = text || input
    if (!msg.trim()) return
    sendMessage(msg)
    setInput('')
  }

  const capabilities = [
    { icon: ShoppingBag, title: 'Find Products', desc: 'Search millions of items', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: TrendingDown, title: 'Compare Prices', desc: 'Get the best deals', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Calculator, title: 'Budget Planning', desc: 'Smart spending advice', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
    { icon: Package, title: 'Track Orders', desc: 'Real-time delivery info', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
    { icon: Wallet, title: 'Savings Tips', desc: 'Maximize your cashback', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-500/10' },
    { icon: MapPin, title: 'Nearby Stores', desc: 'Find local vendors', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-emerald p-6 sm:p-8 text-primary-foreground shadow-glow"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-300 border-2 border-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-black">Gebeya AI Assistant</h1>
              <p className="text-sm text-white/85">Your intelligent shopping companion • Speaks 5 languages</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Capabilities grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl glass p-4"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${cap.bg} mb-2`}>
                <Icon className={`h-4 w-4 ${cap.color}`} />
              </div>
              <div className="font-bold text-sm">{cap.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{cap.desc}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Chat area */}
      <div className="rounded-3xl glass-strong p-4 shadow-premium">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/40">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-bold">Conversation</h2>
          <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
          </span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin p-1 mb-3">
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'w-full'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1 ml-1">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-semibold text-muted-foreground">AI Assistant</span>
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'gradient-emerald text-primary-foreground rounded-br-md'
                      : 'glass rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(s)}
                        className="rounded-full bg-primary/10 hover:bg-primary/20 px-3 py-1 text-xs font-medium text-primary transition-colors tap-highlight-none"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick prompts */}
        {chatMessages.length <= 2 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-semibold text-muted-foreground px-1">Quick prompts:</p>
            {aiQuickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="w-full text-left rounded-xl glass hover:shadow-premium p-3 transition-all tap-highlight-none group"
              >
                <span className="text-sm font-medium group-hover:text-primary transition-colors">{prompt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tools */}
        <div className="flex gap-2 mb-2">
          {[
            { icon: Mic, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Camera, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
            { icon: ScanLine, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
            { icon: Calculator, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((tool, i) => {
            const Icon = tool.icon
            return (
              <button
                key={i}
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${tool.bg} ${tool.color} transition-transform hover:scale-110 active:scale-95 tap-highlight-none`}
              >
                <Icon className="h-4 w-4" />
              </button>
            )
          })}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 rounded-2xl glass p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about shopping..."
            className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl gradient-emerald text-primary-foreground shadow-glow disabled:opacity-40 transition-all hover:scale-105 active:scale-95 tap-highlight-none"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
