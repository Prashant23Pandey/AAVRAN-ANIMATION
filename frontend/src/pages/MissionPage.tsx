import { ArrowLeft, CheckCircle2, Compass, Flag, Route, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GameShell } from '../components/layout/GameShell'
import { MissionCard } from '../components/missions/MissionCard'
import { TacticalMap } from '../components/map/TacticalMap'
import { Panel } from '../components/ui/Panel'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'

export function MissionPage() {
  const mission = useGameStore((state) => state.currentMission)
  const recommendedRoute = useGameStore((state) => state.recommendedRoute)
  const acceptMission = useGameStore((state) => state.acceptMission)
  const completeMission = useGameStore((state) => state.completeMission)
  const escalationActive = useGameStore((state) => state.escalationActive)

  return (
    <GameShell title="MISSION DECK" eyebrow="EMERGENCY OBJECTIVE TRACKING / ACTIVE TASKS">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-4"><MissionCard mission={mission} onAccept={acceptMission} onComplete={completeMission} featured /><Panel eyebrow="MISSION PATH" title="ROUTE VISUALIZATION" right={<StatusPill tone="cyan">ROUTE {recommendedRoute} PLOTTED</StatusPill>}><div className="p-3 sm:p-4"><TacticalMap /></div></Panel></div>
        <aside className="space-y-4"><Panel eyebrow="OBJECTIVE STATUS" title="FIELD CHECKLIST" tone={mission.status === 'COMPLETE' ? 'safe' : 'default'}><div className="space-y-4 p-5">{[
          { label: 'Emergency mission received', done: true, icon: Flag },
          { label: 'Route intelligence analyzed', done: true, icon: Compass },
          { label: 'Responder decision logged', done: mission.status === 'COMPLETE' || mission.status === 'ACTIVE', icon: ShieldCheck },
          { label: 'Emergency beacon reached', done: mission.status === 'COMPLETE', icon: CheckCircle2 },
        ].map(({ label, done, icon: Icon }) => <div key={label} className="flex items-center gap-3"><div className={`grid h-8 w-8 place-items-center border ${done ? 'border-safe/40 bg-safe/10 text-safe' : 'border-white/10 text-muted'}`}><Icon size={15} /></div><p className={`text-sm ${done ? 'text-white' : 'text-muted'}`}>{label}</p></div>)}</div></Panel><Panel eyebrow="EMERGENCY SAFETY CONTRACT" title="NO RISK REWARD"><div className="p-5"><p className="text-sm leading-6 text-muted">The simulation rewards verified information, preparedness and safer route selection during emergency response. It never rewards entering dangerous water.</p><div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4"><Route size={17} className="text-cyan" /><p className="micro-copy">{escalationActive ? 'EMERGENCY SHELTER B IS THE ACTIVE EXTRACTION POINT.' : 'ROUTE B CURRENTLY CARRIES THE LOWER REPORTED RISK.'}</p></div></div></Panel><div className="flex flex-wrap gap-2"><GlowButton variant="secondary" icon={<Link to="/decision"><Compass size={15} /></Link>}><Link to="/decision">OPEN DECISION EVENT</Link></GlowButton><Link to="/survival" className="flex items-center gap-2 px-2 font-mono text-[0.62rem] font-semibold tracking-[0.1em] text-muted hover:text-cyan"><ArrowLeft size={13} /> HUD</Link></div></aside>
      </div>
    </GameShell>
  )
}
