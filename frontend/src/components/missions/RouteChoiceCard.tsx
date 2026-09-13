import { ArrowRight, Footprints, ShieldCheck, TriangleAlert } from 'lucide-react'
import { motion } from 'motion/react'
import type { RouteOption } from '../../types/game'

interface RouteChoiceCardProps {
  route: RouteOption
  selected: boolean
  recommended: boolean
  disabled?: boolean
  onSelect: () => void
}

export function RouteChoiceCard({ route, selected, recommended, disabled, onSelect }: RouteChoiceCardProps) {
  const danger = route.risk === 'HIGH' || route.risk === 'CRITICAL'
  return (
    <motion.button
      type="button"
      className={`relative w-full overflow-hidden border p-4 text-left transition ${selected ? (danger ? 'border-danger bg-danger/10' : 'border-cyan bg-cyan/10') : 'border-white/10 bg-white/[0.025] hover:border-white/30'} ${disabled ? 'cursor-not-allowed opacity-55' : ''}`}
      onClick={onSelect}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -3 }}
      whileTap={disabled ? undefined : { scale: 0.985 }}
    >
      {recommended && <span className="absolute right-0 top-0 bg-cyan px-2 py-1 font-mono text-[0.52rem] font-bold tracking-[0.12em] text-[#00151b]">AI PICK</span>}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="eyebrow text-cyan">ROUTE {route.id}</span>
          <h3 className="mt-2 font-display text-base font-semibold tracking-[0.04em] text-white">{route.label}</h3>
        </div>
        {danger ? <TriangleAlert size={18} className="text-danger-soft" /> : <ShieldCheck size={18} className="text-safe" />}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-y border-white/10 py-3">
        <div><p className="eyebrow">DISTANCE</p><p className="mono-value mt-1 text-sm font-semibold text-white">{route.distanceKm.toFixed(1)} KM</p></div>
        <div><p className="eyebrow">RISK</p><p className={`mono-value mt-1 text-sm font-semibold ${danger ? 'text-danger-soft' : route.risk === 'MEDIUM' ? 'text-amber' : 'text-safe'}`}>{route.risk}</p></div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{route.summary}</p>
      <div className="mt-4 flex items-center justify-between gap-2 text-[0.62rem] font-mono text-muted"><span className="flex items-center gap-1.5"><Footprints size={13} /> {route.estimatedMinutes} MIN</span><span className="flex items-center gap-1.5 text-cyan">SELECT <ArrowRight size={13} /></span></div>
    </motion.button>
  )
}
