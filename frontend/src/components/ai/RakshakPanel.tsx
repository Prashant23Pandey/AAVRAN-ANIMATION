import { BrainCircuit, ChevronRight, Radio, ScanLine, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useGameStore } from '../../store/gameStore'
import { Panel } from '../ui/Panel'
import { GlowButton } from '../ui/GlowButton'
import { StatusPill } from '../ui/StatusPill'

const statusTone = {
  MONITORING: 'cyan',
  ANALYZING: 'amber',
  WARNING: 'danger',
  RECOMMENDING: 'cyan',
  MISSION_UPDATED: 'amber',
  SUCCESS: 'safe',
} as const

export function RakshakPanel({ compact = false }: { compact?: boolean }) {
  const aiStatus = useGameStore((state) => state.aiStatus)
  const aiMessage = useGameStore((state) => state.aiMessage)
  const isThinking = useGameStore((state) => state.isAiThinking)
  const recommendedRoute = useGameStore((state) => state.recommendedRoute)
  const tone = statusTone[aiStatus]

  return (
    <Panel className={compact ? '' : 'h-full'} tone={aiStatus === 'WARNING' ? 'danger' : aiStatus === 'SUCCESS' ? 'safe' : 'default'}>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="holo-core"><div className="radar-sweep" /><span className="holo-spark" /></div>
            <div>
              <p className="eyebrow text-cyan">AI EMERGENCY RESPONSE GUIDE</p>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-[0.06em] text-white">RAKSHAK</h2>
              <p className="micro-copy mt-1">ADAPTIVE FIELD ENGINE / v0.9.4</p>
            </div>
          </div>
          <StatusPill tone={tone}>{aiStatus.replace('_', ' ')}</StatusPill>
        </div>

        <div className="mt-5 border-l border-cyan/50 pl-4">
          <div className="mb-2 flex items-center gap-2 text-cyan">
            <Radio size={14} aria-hidden="true" />
            <span className="eyebrow">DIRECTIVE {isThinking ? 'PROCESSING' : 'LIVE'}</span>
          </div>
          <motion.p key={aiMessage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-sm leading-7 text-white/90">
            {aiMessage}
            {isThinking && <span className="terminal-cursor" aria-hidden="true" />}
          </motion.p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-white/10 py-3">
          <div><p className="eyebrow">RECOMMENDED</p><p className="mono-value mt-1 text-sm font-semibold text-cyan">ROUTE {recommendedRoute}</p></div>
          <div><p className="eyebrow">AI MODE</p><p className="mono-value mt-1 text-sm font-semibold text-white">MOCK / LOCAL</p></div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <GlowButton variant="secondary" icon={<ScanLine size={14} />} onClick={() => undefined} disabled={isThinking}>
            <Link to="/scanner">SCAN AREA</Link>
          </GlowButton>
          <GlowButton variant="ghost" icon={<ChevronRight size={14} />}>
            <Link to="/decision">SHOW ROUTE</Link>
          </GlowButton>
        </div>

        {!compact && (
          <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-muted">
            <BrainCircuit size={14} className="text-cyan" aria-hidden="true" />
            <span className="micro-copy">Structured outputs only. Human confirmation required for reports.</span>
            <Sparkles size={12} className="ml-auto shrink-0 text-amber" aria-hidden="true" />
          </div>
        )}
      </div>
    </Panel>
  )
}
