import React, { useCallback, useState, createContext, useContext } from 'react'
// ToastProvider.tsx — lightweight app-wide toast/snackbar (replaces alert()).

import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2Icon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon,
} from 'lucide-react'
import './Toast.css'
type ToastKind = 'success' | 'error' | 'info'
interface Toast {
  id: number
  kind: ToastKind
  message: string
}
interface ToastApi {
  notify: (kind: ToastKind, message: string) => void
  success: (m: string) => void
  error: (m: string) => void
  info: (m: string) => void
}
const ToastContext = createContext<ToastApi | undefined>(undefined)
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const notify = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [
      ...t,
      {
        id,
        kind,
        message,
      },
    ])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 4200)
  }, [])
  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))
  const api: ToastApi = {
    notify,
    success: (m) => notify('success', m),
    error: (m) => notify('error', m),
    info: (m) => notify('info', m),
  }
  const icons = {
    success: <CheckCircle2Icon size={18} />,
    error: <AlertTriangleIcon size={18} />,
    info: <InfoIcon size={18} />,
  }
  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="toast-stack"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast toast--${t.kind}`}
              initial={{
                opacity: 0,
                y: 16,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: 24,
              }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 30,
              }}
            >
              <span className="toast__icon">{icons[t.kind]}</span>
              <span className="toast__msg">{t.message}</span>
              <button
                className="toast__close"
                aria-label="Dismiss"
                onClick={() => remove(t.id)}
              >
                <XIcon size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
