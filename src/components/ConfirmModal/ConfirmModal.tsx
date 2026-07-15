import React, { useEffect } from 'react'
// ConfirmModal.tsx — reusable confirm-before-destructive-action modal (replaces window.confirm).

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangleIcon } from 'lucide-react'
import './ConfirmModal.css'
interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger,
  busy,
  onConfirm,
  onCancel,
}: Props) {
  // Close on Escape for keyboard users.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={onCancel}
          role="presentation"
        >
          <motion.div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 8,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 32,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`modal-card__icon ${danger ? 'modal-card__icon--danger' : ''}`}
            >
              <AlertTriangleIcon size={22} />
            </div>
            <h3 id="confirm-title" className="modal-card__title">
              {title}
            </h3>
            <p className="modal-card__msg">{message}</p>
            <div className="modal-card__actions">
              <button
                className="btn btn--ghost"
                onClick={onCancel}
                disabled={busy}
              >
                {cancelLabel}
              </button>
              <button
                className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
                onClick={onConfirm}
                disabled={busy}
              >
                {busy ? 'Working…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
