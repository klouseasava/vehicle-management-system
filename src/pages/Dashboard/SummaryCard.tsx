import React from 'react'
// SummaryCard.tsx — a single dashboard metric card, links to a relevant screen.

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRightIcon } from 'lucide-react'
import './Dashboard.css'
interface Props {
  icon: React.ReactNode
  label: string
  value: string | number
  hint: string
  tone: 'amber' | 'red' | 'blue' | 'green'
  to: string
}
export function SummaryCard({ icon, label, value, hint, tone, to }: Props) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 12,
        },
        show: {
          opacity: 1,
          y: 0,
        },
      }}
    >
      <Link to={to} className={`summary-card summary-card--${tone}`}>
        <div className="summary-card__top">
          <span className="summary-card__icon">{icon}</span>
          <ArrowUpRightIcon size={16} className="summary-card__go" />
        </div>
        <span className="summary-card__value mono">{value}</span>
        <span className="summary-card__label">{label}</span>
        <span className="summary-card__hint">{hint}</span>
      </Link>
    </motion.div>
  )
}
