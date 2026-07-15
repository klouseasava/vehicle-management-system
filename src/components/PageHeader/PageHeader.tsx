import React from 'react'
// PageHeader.tsx — consistent page title + optional actions row.

import './PageHeader.css'
interface Props {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}
export function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  )
}
