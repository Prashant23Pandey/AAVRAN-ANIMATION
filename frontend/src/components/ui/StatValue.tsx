import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface StatValueProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  tone?: 'cyan' | 'safe' | 'amber' | 'danger' | 'muted'
}

export function StatValue({ label, value, icon, tone = 'muted' }: StatValueProps) {
  const color = {
    cyan: 'text-cyan',
    safe: 'text-safe',
    amber: 'text-amber',
    danger: 'text-danger-soft',
    muted: 'text-ink',
  }[tone]

  return (
    <motion.div className="flex items-center gap-2" layout>
      {icon && <span className={`shrink-0 ${color}`}>{icon}</span>}
      <div className="min-w-0">
        <p className="eyebrow truncate">{label}</p>
        <p className={`mono-value mt-1 text-sm font-semibold ${color}`}>{value}</p>
      </div>
    </motion.div>
  )
}
