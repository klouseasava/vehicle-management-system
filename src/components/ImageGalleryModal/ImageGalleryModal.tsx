import React, { useEffect, useState } from 'react'
// ImageGalleryModal.tsx — accessible, animated vehicle photo viewer.

import { AnimatePresence, motion } from 'framer-motion'
import { ImageIcon, XIcon } from 'lucide-react'
import './ImageGalleryModal.css'
export function ImageGalleryModal({
  open,
  images,
  title,
  onClose,
}: {
  open: boolean
  images: string[]
  title: string
  onClose: () => void
}) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (open) setActive(0)
  }, [open])
  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="gallery-overlay"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={onClose}
        >
          <motion.section
            className="gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} images`}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 14,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: 8,
            }}
            transition={{
              type: 'spring',
              stiffness: 360,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="gallery-modal__head">
              <div>
                <h2>{title}</h2>
                <p>
                  {images.length
                    ? `${images.length} vehicle image${images.length === 1 ? '' : 's'}`
                    : 'No images uploaded'}
                </p>
              </div>
              <button
                className="btn btn--icon"
                onClick={onClose}
                aria-label="Close image gallery"
              >
                <XIcon size={18} />
              </button>
            </header>
            {images.length ? (
              <>
                <div className="gallery-modal__canvas">
                  <img
                    src={images[active]}
                    alt={`${title}, image ${active + 1}`}
                  />
                </div>
                <div className="gallery-modal__thumbs">
                  {images.map((image, i) => (
                    <button
                      key={image}
                      className={`gallery-modal__thumb ${i === active ? 'gallery-modal__thumb--active' : ''}`}
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="gallery-modal__empty">
                <ImageIcon size={30} />
                <p>No vehicle photos are available yet.</p>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
