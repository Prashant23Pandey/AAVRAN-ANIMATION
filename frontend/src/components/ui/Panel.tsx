import type { ReactNode } from 'react'

interface PanelProps {
  children: ReactNode
  className?: string
  title?: string
  eyebrow?: string
  right?: ReactNode
  tone?: 'default' | 'safe' | 'danger'
}

export function Panel({ children, className = '', title, eyebrow, right, tone = 'default' }: PanelProps) {
  const toneClass = tone === 'safe' ? 'hud-panel-safe' : tone === 'danger' ? 'hud-panel-danger' : ''

  return (
    <section className={`hud-panel corner-bracket ${toneClass} ${className}`.trim()}>
      {(title || eyebrow || right) && (
        <header className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
            {title && <h2 className="font-display text-sm font-semibold tracking-[0.08em] text-white">{title}</h2>}
          </div>
          {right}
        </header>
      )}
      {children}
    </section>
  )
}
