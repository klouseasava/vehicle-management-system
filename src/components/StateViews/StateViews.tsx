import React from 'react'
// StateViews.tsx — shared loading / empty / error states for every list & table screen.

import { LoaderIcon, InboxIcon, WifiOffIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import './StateViews.css'
export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="state-view" role="status" aria-live="polite">
      <motion.span
        className="state-view__spinner"
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 0.9,
        }}
      >
        <LoaderIcon size={26} />
      </motion.span>
      <p className="state-view__text">{label}</p>
    </div>
  )
}
export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: React.ReactNode
}) {
  return (
    <div className="state-view">
      <span className="state-view__icon">
        <InboxIcon size={30} />
      </span>
      <p className="state-view__title">{title}</p>
      {hint && <p className="state-view__text">{hint}</p>}
      {action && <div className="state-view__action">{action}</div>}
    </div>
  )
}
export function ErrorState({
  message,
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="state-view">
      <span className="state-view__icon state-view__icon--error">
        <WifiOffIcon size={30} />
      </span>
      <p className="state-view__title">Something went wrong</p>
      <p className="state-view__text">
        {message || 'The backend could not be reached.'}
      </p>
      {onRetry && (
        <div className="state-view__action">
          <button className="btn btn--ghost" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
