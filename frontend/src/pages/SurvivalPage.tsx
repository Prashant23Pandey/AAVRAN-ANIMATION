import { Activity, BatteryCharging, ChevronRight, Clock3, Droplets, Gauge, Radio, ShieldAlert, Star, Target, TrendingUp, Users, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { GameShell } from '../components/layout/GameShell'
import { RakshakPanel } from '../components/ai/RakshakPanel'
import { TacticalMap } from '../components/map/TacticalMap'
import { MissionCard } from '../components/missions/MissionCard'
import { Panel } from '../components/ui/Panel'
import { GlowButton } from '../components/ui/GlowButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatValue } from '../components/ui/StatValue'
import { LazyWaterTelemetryChart } from '../components/charts/LazyWaterTelemetryChart'
import { useGameStore } from '../store/gameStore'

export function SurvivalPage() {
  const player = useGameStore((state) => state.player)
  const mission = useGameStore((state) => state.currentMission)
  const community = useGameStore((state) => state.community)
  const floodLevel = useGameStore((state) => state.floodLevel)
  const roads = useGameStore((state) => state.roads)
  const shelters = useGameStore((state) => state.shelters)
  const floodTimeline = useGameStore((state) => state.floodTimeline)
  const aiStatus = useGameStore((state) => state.aiStatus)
  const lastAction = useGameStore((state) => state.lastAction)
  const acceptMission = useGameStore((state) => state.acceptMission)
  const completeMission = useGameStore((state) => state.completeMission)
  const followRoute = useGameStore((state) => state.followRoute)
  const escalationActive = useGameStore((state) => state.escalationActive)

  return (
    <GameShell title="EMERGENCY RESPONSE HUD" eyebrow="ZONE 04 / LOWER EAST">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`relative overflow-hidden border px-4 py-3 ${escalationActive ? 'border-danger/50 bg-danger/10' : 'border-cyan/20 bg-cyan/5'}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center ${escalationActive ? 'bg-danger/15 text-danger-soft' : 'bg-cyan/10 text-cyan'}`}><Radio size={17} className={escalationActive ? 'animate-pulse' : ''} /></div><div><p className={`eyebrow ${escalationActive ? 'text-danger-soft' : 'text-cyan'}`}>{escalationActive ? 'EMERGENCY EVENT / FLOOD ESCALATION' : 'CURRENT CONDITION / AI MONITORING'}</p><p className="mt-1 text-sm text-white">{escalationActive ? 'Your previous emergency route is no longer recommended. Situation changed live.' : 'RAKSHAK is watching verified reports, roads and shelter capacity.'}</p></div></div><Link to={escalationActive ? '/mission' : '/demo'} className="shrink-0 font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-cyan hover:text-white">{escalationActive ? 'VIEW UPDATED MISSION →' : 'OPEN DEMO CONTROLS →'}</Link></div>
          </motion.div>
          <TacticalMap />
          <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
            <MissionCard mission={mission} onAccept={acceptMission} onComplete={completeMission} featured />
            <Panel eyebrow="COMMUNITY EVACUATION" title="ZONE 04 / LIVE">
              <div className="p-5"><div className="flex items-end justify-between gap-3"><div><p className="display-title text-4xl text-white">{community.safe}<span className="text-muted">/{community.targetSafe}</span></p><p className="eyebrow mt-2 text-safe">CITIZENS EVACUATED</p></div><Users size={25} className="text-safe" /></div><ProgressBar value={(community.safe / community.targetSafe) * 100} tone="safe" className="mt-5" label="Community safety progress" /><p className="micro-copy mt-3">EVACUATE {community.targetSafe} CITIZENS TO SAFETY</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4"><StatValue label="Evacuating" value={community.evacuating} icon={<TrendingUp size={14} />} tone="amber" /><StatValue label="Unverified" value={community.unverified} icon={<ShieldAlert size={14} />} tone="danger" /></div><Link to="/community" className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[0.62rem] font-semibold tracking-[0.12em] text-cyan hover:text-white">OPEN COMMUNITY <ChevronRight size={14} /></Link></div>
            </Panel>
          </div>
        </div>
        <aside className="space-y-4">
          <RakshakPanel />
            <Panel eyebrow="EMERGENCY TELEMETRY" title="RESOURCE STATUS">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5 p-5"><StatValue label="Health" value={`${player.health}%`} icon={<Gauge size={15} />} tone={player.health < 50 ? 'danger' : 'safe'} /><StatValue label="Battery" value={`${player.battery}%`} icon={<BatteryCharging size={15} />} tone={player.battery < 20 ? 'danger' : 'cyan'} /><StatValue label="Water" value={player.water} icon={<Droplets size={15} />} tone="cyan" /><StatValue label="XP" value={`${player.xp}`} icon={<Star size={15} />} tone="amber" /></div><div className="border-t border-white/10 px-5 py-4"><div className="flex items-center justify-between"><span className="eyebrow">BATTERY RESERVE</span><span className={`mono-value text-xs ${player.battery < 20 ? 'text-danger-soft' : 'text-cyan'}`}>{player.battery}%</span></div><ProgressBar value={player.battery} tone={player.battery < 20 ? 'danger' : 'cyan'} className="mt-3" label="Battery reserve" /></div>
          </Panel>
          <Panel eyebrow="FIELD LOG" title="LATEST SIGNALS" right={<Activity size={15} className="text-cyan" />}>
            <div className="divide-y divide-white/10">{[
              { time: '19:14', label: lastAction, tone: 'text-cyan' },
              { time: '19:12', label: `AI status / ${aiStatus}`, tone: 'text-amber' },
              { time: '19:10', label: `Shelter A / ${shelters[0]?.capacityPercent}% full`, tone: shelters[0]?.status === 'FULL' ? 'text-danger-soft' : 'text-muted' },
              { time: '19:08', label: `Road A / ${roads[0]?.status}`, tone: roads[0]?.status === 'BLOCKED' ? 'text-danger-soft' : 'text-muted' },
            ].map((item) => <div key={item.time + item.label} className="flex gap-3 px-5 py-3"><span className="mono-value text-[0.6rem] text-muted">{item.time}</span><p className={`min-w-0 text-xs leading-5 ${item.tone}`}>{item.label}</p></div>)}</div>
          </Panel>
        </aside>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel eyebrow="WATER LEVEL / FLOOD RISK" title="RISING SIGNAL" right={<span className="flex items-center gap-2 font-mono text-[0.6rem] text-danger-soft"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger-soft" /> LIVE</span>}><div className="p-4 sm:p-5"><LazyWaterTelemetryChart data={floodTimeline} /></div></Panel>
        <Panel eyebrow="OPERATIONAL READOUT" title="NEXT BEST ACTION"><div className="grid gap-3 p-5"><div className="flex items-start gap-3"><Target size={17} className="mt-0.5 text-cyan" /><div><p className="eyebrow text-cyan">AI RECOMMENDATION</p><p className="mt-1 text-sm text-white">Follow the verified high-ground emergency beacon before the next water-level update.</p></div></div><div className="flex items-start gap-3"><Clock3 size={17} className="mt-0.5 text-amber" /><div><p className="eyebrow text-amber">WINDOW</p><p className="mt-1 text-sm text-white">{floodLevel === 'CRITICAL' ? 'Immediate emergency deployment required' : '18 minutes until next model refresh'}</p></div></div><GlowButton variant="secondary" className="mt-2 w-full" onClick={() => followRoute()} icon={<Zap size={15} />}>FOLLOW AI ROUTE</GlowButton></div></Panel>
      </div>
    </GameShell>
  )
}
