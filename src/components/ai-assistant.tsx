'use client'

import { useAppStore } from '@/lib/store'
import { aiQuickPrompts } from '@/lib/data'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  X, Send, Sparkles, Mic, Camera, ScanLine, Trash2,
  Calculator,
} from 'lucide-react'

export function AIAssistant() {
  const { aiOpen, setAiOpen, chatMessages, sendMessage } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)
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

  const tools = [
    { icon: Mic, label: 'Voice', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Camera, label: 'Image', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10' },
    { icon: ScanLine, label: 'Scan', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10' },
    { icon: Calculator, label: 'Budget', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  return (
    <AnimatePresence>
      {aiOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setAiOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-4 z-50 mx-auto sm:m-0 w-full sm:w-[440px] flex flex-col rounded-t-3xl sm:rounded-3xl glass-strong shadow-premium overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 gradient-emerald text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-300 border-2 border-emerald-600" />
                </div>
                <div>
                  <h2 className="font-bold text-sm">Gebeya AI Assistant</h2>
                  <p className="text-xs text-white/80">Online • Speaks 5 languages</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-lg p-2 hover:bg-white/15 transition-colors"
                  aria-label="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAiOpen(false)}
                  className="rounded-lg p-2 hover:bg-white/15 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
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

                    {/* Suggestions */}
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

              {/* Quick prompts (only show at start) */}
              {chatMessages.length === 1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-muted-foreground px-1">Try asking:</p>
                  {aiQuickPrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left rounded-xl glass hover:shadow-premium p-3 transition-all tap-highlight-none group"
                    >
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{prompt}</span>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/40 p-3 space-y-2">
              {/* Tools */}
              <div className="flex gap-2">
                {tools.map((tool, i) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={i}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${tool.bg} ${tool.color} transition-transform hover:scale-110 active:scale-95 tap-highlight-none`}
                      aria-label={tool.label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 rounded-2xl glass p-2">
                <input
                  ref={inputRef}
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
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
