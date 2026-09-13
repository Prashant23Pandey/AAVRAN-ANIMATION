import { ArrowLeft, Crosshair, Navigation, Signal, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GameShell } from '../components/layout/GameShell'
import { TacticalMap } from '../components/map/TacticalMap'
import { Panel } from '../components/ui/Panel'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'
import type { RouteId } from '../types/game'

export function MapPage() {
  const routes = useGameStore((state) => state.routes)
  const recommendedRoute = useGameStore((state) => state.recommendedRoute)
  const followRoute = useGameStore((state) => state.followRoute)
  const shelters = useGameStore((state) => state.shelters)
  const roads = useGameStore((state) => state.roads)
  const reports = useGameStore((state) => state.reports)

  return (
    <GameShell title="TACTICAL MAP" eyebrow="EMERGENCY ROUTE INTELLIGENCE / VECTOR BOARD">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0"><TacticalMap focus="full" selectedRoute={recommendedRoute} onRouteClick={(route: RouteId) => followRoute(route)} /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><StatusPill tone="cyan"><Crosshair size={12} /> CLICK ROUTE TO FOCUS</StatusPill><span className="micro-copy">Vector fallback / no map API required</span></div><Link to="/survival" className="flex items-center gap-2 font-mono text-[0.62rem] font-semibold tracking-[0.1em] text-muted hover:text-cyan"><ArrowLeft size={13} /> BACK TO HUD</Link></div></div>
        <aside className="space-y-4">
          <Panel eyebrow="AI ROUTE SYSTEM" title="ACTIVE RECOMMENDATION" tone="safe"><div className="p-5"><div className="flex items-center justify-between"><div><p className="eyebrow text-safe">ROUTE {recommendedRoute}</p><p className="display-title mt-2 text-3xl text-white">LOWER RISK</p></div><Navigation size={28} className="text-safe" /></div><p className="mt-4 text-sm leading-6 text-muted">RAKSHAK weighs distance, flood reports, road status, shelter capacity and battery before plotting this line.</p><button type="button" onClick={() => followRoute(recommendedRoute)} className="mt-5 flex w-full items-center justify-between border border-safe/35 bg-safe/10 px-3 py-3 font-mono text-[0.62rem] font-semibold tracking-[0.1em] text-safe transition hover:bg-safe/15">FOLLOW AI ROUTE <Signal size={14} /></button></div></Panel>
          <Panel eyebrow="ROUTE MATRIX" title="THREE OPTIONS"><div className="divide-y divide-white/10">{routes.map((route) => <button type="button" key={route.id} onClick={() => followRoute(route.id)} className={`flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition hover:bg-white/[0.03] ${route.id === recommendedRoute ? 'bg-cyan/5' : ''}`}><div><p className="eyebrow text-cyan">ROUTE {route.id} {route.id === recommendedRoute && <span className="text-safe">/ AI PICK</span>}</p><p className="mt-1 text-sm font-semibold text-white">{route.label}</p><p className="micro-copy mt-1">{route.distanceKm.toFixed(1)} KM / {route.estimatedMinutes} MIN</p></div><span className={`font-mono text-[0.6rem] font-semibold ${route.risk === 'LOW' ? 'text-safe' : route.risk === 'MEDIUM' ? 'text-amber' : 'text-danger-soft'}`}>{route.risk}</span></button>)}</div></Panel>
          <Panel eyebrow="MAP SIGNALS" title="FIELD CONDITIONS"><div className="space-y-3 p-5">{roads.map((road) => <div key={road.id} className="flex items-center justify-between gap-3"><span className="micro-copy text-white/75">{road.name}</span><StatusPill tone={road.status === 'BLOCKED' ? 'danger' : road.status === 'CAUTION' ? 'amber' : 'safe'} dot={false}>{road.status}</StatusPill></div>)}<div className="border-t border-white/10 pt-3">{shelters.map((shelter) => <div key={shelter.id} className="flex items-center justify-between gap-3 py-1"><span className="micro-copy text-white/75">{shelter.name}</span><span className="mono-value text-xs text-muted">{shelter.capacityPercent}% / {shelter.status}</span></div>)}</div>{reports.length > 0 && <div className="flex items-start gap-2 border border-danger/30 bg-danger/5 p-3"><TriangleAlert size={15} className="mt-0.5 shrink-0 text-danger-soft" /><p className="micro-copy text-danger-soft">{reports.length} verified hazard report pinned. Human-confirmed map state.</p></div>}</div></Panel>
        </aside>
      </div>
    </GameShell>
  )
}
