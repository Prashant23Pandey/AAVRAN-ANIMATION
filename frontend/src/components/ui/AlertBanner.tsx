import { AlertTriangle, ChevronRight, Info, ShieldAlert, Siren, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { eventManager } from '../../services/eventManager'
import type { ActiveAlert } from '../../data/disasterScenarios'

const severityConfig = {
  INFO: { icon: Info, bg: 'bg-cyan/10', border: 'border-cyan/30', text: 'text-cyan', label: 'INFO' },
  ADVISORY: { icon: AlertTriangle, bg: 'bg-amber/10', border: 'border-amber/30', text: 'text-amber', label: 'ADVISORY' },
  WARNING: { icon: ShieldAlert, bg: 'bg-amber/15', border: 'border-amber/40', text: 'text-amber', label: 'WARNING' },
  CRITICAL: { icon: Siren, bg: 'bg-danger/10', border: 'border-danger/50', text: 'text-danger-soft', label: 'CRITICAL' },
} as const

export function AlertBanner() {
  const [alerts, setAlerts] = useState<ActiveAlert[]>([])

  useEffect(() => {
    const unsubscribe = eventManager.subscribe((alert) => {
      setAlerts((prev) => [...prev, alert])
    })
    return unsubscribe
  }, [])

  const dismiss = useCallback((id: string) => {
    eventManager.dismissAlert(id)
    setAlerts((prev) => prev.filter((a) => a.scenario.id !== id))
  }, [])

  const visibleAlerts = alerts.filter((a) => !a.dismissed).slice(0, 2)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex flex-col items-center gap-2 px-4 sm:px-6" role="alert" aria-live="assertive">
      <AnimatePresence mode="popLayout">
        {visibleAlerts.map((alert) => {
          const config = severityConfig[alert.scenario.severity]
          const Icon = config.icon
          return (
            <motion.div
              key={alert.scenario.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`pointer-events-auto w-full max-w-2xl overflow-hidden border ${config.border} ${config.bg} backdrop-blur-xl`}
            >
              <div className="flex items-start gap-3 p-4">
                <div className={`grid h-9 w-9 shrink-0 place-items-center ${config.text}`}>
                  <Icon size={20} className={alert.scenario.severity === 'CRITICAL' ? 'animate-pulse' : ''} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[0.6rem] font-bold tracking-[0.14em] ${config.text}`}>
                      {config.label}
                    </span>
                    <span className="font-mono text-[0.6rem] tracking-[0.1em] text-white/50">
                      / {alert.scenario.title}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-white/90">
                    {alert.scenario.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(alert.scenario.id)}
                  className="grid h-7 w-7 shrink-0 place-items-center text-muted transition hover:text-white"
                  aria-label="Dismiss alert"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 px-4 py-2">
                <span className="font-mono text-[0.55rem] tracking-[0.1em] text-white/40">
                  EMERGENCY RESPONSE PROTOCOL
                </span>
                <button
                  type="button"
                  onClick={() => dismiss(alert.scenario.id)}
                  className={`flex items-center gap-1 font-mono text-[0.55rem] font-semibold tracking-[0.1em] ${config.text} transition hover:underline`}
                >
                  ACKNOWLEDGE <ChevronRight size={10} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
