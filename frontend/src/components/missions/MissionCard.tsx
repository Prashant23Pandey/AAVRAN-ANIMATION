import { ArrowUpRight, Clock3, MapPinned, ShieldAlert, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Mission } from '../../types/game'
import { GlowButton } from '../ui/GlowButton'
import { ProgressBar } from '../ui/ProgressBar'
import { StatusPill } from '../ui/StatusPill'


interface MissionCardProps {
  mission: Mission
  onAccept?: () => void
  onComplete?: () => void
  featured?: boolean
}

export function MissionCard({ mission, onAccept, onComplete, featured = false }: MissionCardProps) {
  const active = mission.status === 'ACTIVE'
  const complete = mission.status === 'COMPLETE'
  const riskClass = mission.risk === 'LOW' ? 'text-safe' : mission.risk === 'MEDIUM' ? 'text-amber' : 'text-danger-soft'
  return (
    <motion.article layout className={`hud-panel ${featured ? 'border-cyan/40' : ''} ${mission.risk === 'CRITICAL' ? 'hud-panel-danger' : ''}`}>
      <div className="mission-stripe absolute inset-x-0 top-0 h-1 opacity-70" />
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-cyan">{mission.id.replace('-', ' / ').toUpperCase()}</span>
              <StatusPill tone={complete ? 'safe' : active ? 'cyan' : 'amber'}>{mission.status}</StatusPill>
            </div>
            <h2 className="display-title mt-3 text-2xl text-white sm:text-3xl">{mission.title}</h2>
          </div>
          <div className="grid h-11 w-11 place-items-center border border-cyan/25 bg-cyan/5 text-cyan">
            {complete ? <Sparkles size={18} /> : <MapPinned size={18} />}
          </div>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted">{mission.description}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.025] p-3"><p className="eyebrow">OBJECTIVE</p><p className="mt-2 text-xs leading-5 text-white/80">{mission.objective}</p></div>
          <div className="border border-white/10 bg-white/[0.025] p-3"><p className="eyebrow">DISTANCE</p><p className="mono-value mt-2 text-lg font-semibold text-white">{mission.distanceKm.toFixed(1)} <span className="text-xs text-muted">KM</span></p></div>
          <div className="border border-white/10 bg-white/[0.025] p-3"><p className="eyebrow">REWARD</p><p className="mono-value mt-2 text-lg font-semibold text-amber">+{mission.rewardXp} <span className="text-xs text-muted">XP</span></p></div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2"><ShieldAlert size={15} className={riskClass} /><span className={`font-mono text-xs font-semibold tracking-[0.12em] ${riskClass}`}>RISK / {mission.risk}</span></div>
          <div className="flex items-center gap-1.5 text-muted"><Clock3 size={14} /><span className="mono-value text-xs">ETA {Math.round(mission.distanceKm * 16)} MIN</span></div>
        </div>
        {active && <ProgressBar value={42} tone="cyan" className="mt-4" label="Mission objective" />}
        <div className="mt-5 flex flex-wrap gap-2">
          {!active && !complete && onAccept && <GlowButton onClick={onAccept} icon={<ArrowUpRight size={15} />}>ACCEPT MISSION</GlowButton>}
          {active && onComplete && <GlowButton onClick={onComplete} icon={<Sparkles size={15} />}>COMPLETE MISSION</GlowButton>}
          {complete && <GlowButton variant="secondary" icon={<Sparkles size={15} />}><Link to="/results">VIEW SURVIVAL RESULTS</Link></GlowButton>}
          <GlowButton variant="ghost"><Link to="/decision">OPEN DECISION EVENT</Link></GlowButton>
        </div>
      </div>
    </motion.article>
  )
}
