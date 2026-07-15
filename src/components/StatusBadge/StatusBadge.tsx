import React from 'react'
// StatusBadge.tsx — one consistent, colorblind-considerate status pill used across all screens.
// Each status pairs a hue with a text label (never color-only) and a small dot.

import './StatusBadge.css'
// Maps any known status string to a token class.
function tokenFor(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('motion')) return 'motion'
  if (s.includes('park')) return 'parked'
  if (s.includes('repair')) return 'repair'
  if (s === 'active' || (s.includes('assigned') && !s.includes('un')))
    return 'authorized'
  if (s.includes('overdue') || s.includes('critical')) return 'overdue'
  if (s === 'pending') return 'pending'
  if (s.includes('unassigned') || s.includes('archiv')) return 'parked'
  return 'neutral'
}
export function StatusBadge({ status }: { status: string }) {
  const token = tokenFor(status)
  return (
    <span className={`status-badge status-badge--${token}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {status}
    </span>
  )
}
