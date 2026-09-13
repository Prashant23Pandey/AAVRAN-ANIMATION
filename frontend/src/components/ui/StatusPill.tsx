import type { ReactNode } from 'react'

interface StatusPillProps {
  children: ReactNode
  tone?: 'cyan' | 'safe' | 'amber' | 'danger' | 'muted'
  dot?: boolean
}

export function StatusPill({ children, tone = 'muted', dot = true }: StatusPillProps) {
  return (
    <span className={`status-pill status-pill-${tone}`}>
      {dot && <span className="status-dot" aria-hidden="true" />}
      {children}
    </span>
  )
}
