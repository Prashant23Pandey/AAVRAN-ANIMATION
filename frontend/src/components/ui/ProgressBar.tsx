import { motion } from 'motion/react'

interface ProgressBarProps {
  value: number
  tone?: 'cyan' | 'safe' | 'amber' | 'danger'
  className?: string
  label?: string
}

export function ProgressBar({ value, tone = 'cyan', className = '', label }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value))
  return (
    <div className={className}>
      {label && <span className="sr-only">{label}: {Math.round(safeValue)}%</span>}
      <div className="progress-track" aria-hidden="true">
        <motion.div
          className={`progress-fill progress-fill-${tone}`}
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
