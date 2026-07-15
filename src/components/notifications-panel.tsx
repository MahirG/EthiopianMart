'use client'

import { useAppStore } from '@/lib/store'
import { notifications as defaultNotifs } from '@/lib/data'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, Check } from 'lucide-react'
import { useState } from 'react'

export function NotificationsPanel() {
  const { notifOpen, setNotifOpen } = useAppStore()
  const [notifs, setNotifs] = useState(defaultNotifs)
  const unread = notifs.filter((n) => !n.read).length

  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))

  return (
    <AnimatePresence>
      {notifOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setNotifOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col glass-strong shadow-premium"
          >
            <div className="flex items-center justify-between border-b border-border/50 p-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-emerald text-primary-foreground">
                    <Bell className="h-5 w-5" />
                  </div>
                  {unread > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unread}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold">Notifications</h2>
                  <p className="text-xs text-muted-foreground">{unread} unread messages</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllRead}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="rounded-lg p-2 hover:bg-accent transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-2">
              {notifs.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex gap-3 rounded-2xl p-4 transition-colors cursor-pointer ${
                    n.read ? 'bg-card/50' : 'bg-primary/5 border border-primary/20'
                  } hover:bg-accent/50`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-xl">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm">{n.title}</h3>
                      {!n.read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{n.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-border/50 p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl gradient-emerald py-3 font-semibold text-primary-foreground shadow-glow">
                <Check className="h-4 w-4" />
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
