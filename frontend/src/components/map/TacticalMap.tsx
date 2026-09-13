import { motion } from 'motion/react'
import { Waves } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import type { RiskLevel, RouteId } from '../../types/game'
import { StatusPill } from '../ui/StatusPill'

interface TacticalMapProps {
  focus?: 'full' | 'compact'
  selectedRoute?: RouteId
  onRouteClick?: (route: RouteId) => void
}

const toneForRisk = (risk: RiskLevel) => {
  if (risk === 'LOW') return '#35e58c'
  if (risk === 'MEDIUM') return '#ffab00'
  return '#ff4d5a'
}

export function TacticalMap({ focus = 'compact', selectedRoute, onRouteClick }: TacticalMapProps) {
  const roads = useGameStore((state) => state.roads)
  const shelters = useGameStore((state) => state.shelters)
  const reports = useGameStore((state) => state.reports)
  const recommendedRoute = useGameStore((state) => state.recommendedRoute)
  const floodLevel = useGameStore((state) => state.floodLevel)
  const escalationActive = useGameStore((state) => state.escalationActive)
  const activeRoute = selectedRoute ?? recommendedRoute

  const roadA = roads.find((road) => road.id === 'road-a')
  const shelterA = shelters.find((shelter) => shelter.id === 'shelter-a')
  const hasHazard = reports.length > 0 || roadA?.status === 'BLOCKED'

  return (
    <div className={`map-canvas ${focus === 'full' ? 'min-h-[560px]' : ''}`}>
      <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
        <StatusPill tone={floodLevel === 'CRITICAL' ? 'danger' : floodLevel === 'HIGH' ? 'amber' : 'cyan'}>
          <Waves size={12} aria-hidden="true" /> FLOOD LAYER {floodLevel}
        </StatusPill>
        {escalationActive && <StatusPill tone="danger">LIVE ESCALATION</StatusPill>}
      </div>
      <div className="absolute bottom-4 left-4 z-10 max-w-[190px] border border-white/10 bg-[#020813]/80 p-3 backdrop-blur-md">
        <p className="eyebrow mb-2 text-cyan">TACTICAL LEGEND</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[0.59rem] text-muted">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_9px_#00f0ff]" /> YOU</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-safe shadow-[0_0_9px_#35e58c]" /> SAFE</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber shadow-[0_0_9px_#ffab00]" /> CAUTION</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger-soft shadow-[0_0_9px_#ff4d5a]" /> DANGER</span>
        </div>
      </div>
      <div className="absolute right-4 top-4 z-10 border border-white/10 bg-[#020813]/76 px-3 py-2 text-right backdrop-blur-md">
        <p className="eyebrow">ZONE COORDINATES</p>
        <p className="mono-value mt-1 text-xs font-semibold text-white">17.482° N / 78.391° E</p>
        <p className="micro-copy mt-1 text-[0.58rem]">LIVE SIMULATION / +03:18</p>
      </div>
      <svg viewBox="0 0 900 560" role="img" aria-label="Dynamic tactical flood map with routes, shelters, hazards and player position">
        <defs>
          <linearGradient id="water-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#0e5264" stopOpacity="0.16" />
            <stop offset="1" stopColor="#00f0ff" stopOpacity="0.38" />
          </linearGradient>
          <filter id="cyan-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="danger-glow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <path d="M0 428 C120 382 136 452 246 410 S392 376 470 418 S616 468 714 410 S812 332 900 364 L900 560 L0 560 Z" fill="url(#water-gradient)" opacity="0.62" />
        <path d="M28 120 C190 186 205 70 340 142 S512 216 646 138 S780 76 886 120" fill="none" stroke="#2f6074" strokeWidth="16" opacity="0.55" />
        <path d="M8 182 C168 238 214 154 320 208 S520 290 650 222 S800 164 900 222" fill="none" stroke="#1e4558" strokeWidth="4" opacity="0.75" />
        <path d="M50 470 C170 420 230 472 332 418 S502 380 600 420 S756 474 856 404" fill="none" stroke="#194454" strokeWidth="3" strokeDasharray="11 16" opacity="0.85" />
        <path d="M104 58 L236 176 L182 322 L334 486" fill="none" stroke="#24566a" strokeWidth="2" opacity="0.72" />
        <path d="M762 26 L648 140 L698 308 L582 486" fill="none" stroke="#24566a" strokeWidth="2" opacity="0.72" />
        <path d="M365 26 L414 158 L376 282 L430 516" fill="none" stroke="#24566a" strokeWidth="2" opacity="0.6" />
        <path d="M104 58 L314 70 L506 48 L762 26" fill="none" stroke="#24566a" strokeWidth="2" opacity="0.6" />
        <path d="M182 322 L378 282 L584 300 L698 308" fill="none" stroke="#24566a" strokeWidth="2" opacity="0.6" />
        <path d="M52 522 L212 444 L430 516 L650 458 L856 524" fill="none" stroke="#24566a" strokeWidth="2" opacity="0.5" />

        <motion.path d="M176 425 C246 372 286 334 350 300 S480 204 600 170 S694 126 758 102" fill="none" stroke={activeRoute === 'B' ? '#00f0ff' : '#427082'} strokeWidth={activeRoute === 'B' ? 5 : 3} strokeLinecap="round" filter={activeRoute === 'B' ? 'url(#cyan-glow)' : undefined} initial={{ pathLength: 0 }} animate={{ pathLength: activeRoute === 'B' ? 1 : 0.38 }} transition={{ duration: 1.35, ease: 'easeInOut' }} />
        <motion.path d="M176 425 C228 390 288 350 338 308 S378 234 420 206 S504 170 566 188" fill="none" stroke={activeRoute === 'A' ? '#ff4d5a' : '#78404b'} strokeWidth={activeRoute === 'A' ? 4 : 2} strokeDasharray="8 14" strokeLinecap="round" filter={activeRoute === 'A' ? 'url(#danger-glow)' : undefined} initial={{ pathLength: 0 }} animate={{ pathLength: activeRoute === 'A' ? 1 : 0.3 }} transition={{ duration: 1.2, ease: 'easeInOut' }} />
        <motion.path d="M176 425 C242 456 306 456 378 430 S510 378 602 338 S724 270 800 244" fill="none" stroke={activeRoute === 'C' ? '#ffab00' : '#755c29'} strokeWidth={activeRoute === 'C' ? 4 : 2} strokeDasharray="4 12" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: activeRoute === 'C' ? 1 : 0.28 }} transition={{ duration: 1.1, ease: 'easeInOut' }} />

        {roadA?.status === 'BLOCKED' && <g><path d="M340 308 l-24 -18 m24 18 l24 18 M327 290 l26 36" stroke="#ff4d5a" strokeWidth="6" strokeLinecap="round" /><text x="298" y="270" fill="#ff8b98" fontSize="12" fontFamily="JetBrains Mono">ROAD A / BLOCKED</text></g>}
        <g className="marker-pulse"><circle cx="176" cy="425" r="20" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.7" /><circle cx="176" cy="425" r="7" fill="#00f0ff" filter="url(#cyan-glow)" /><path d="M176 408 L182 422 L176 438 L170 422 Z" fill="#f4f8fb" /><text x="196" y="430" fill="#c2f9ff" fontSize="13" fontFamily="JetBrains Mono" fontWeight="600">YOU / ZONE 04</text></g>
        <g className="marker-pulse"><circle cx="758" cy="102" r="22" fill="none" stroke="#35e58c" strokeWidth="2" opacity="0.7" /><circle cx="758" cy="102" r="7" fill="#35e58c" filter="url(#cyan-glow)" /><path d="M749 105 L758 94 L767 105 L767 114 L749 114 Z" fill="#35e58c" /><text x="705" y="76" fill="#8af4b8" fontSize="12" fontFamily="JetBrains Mono">SHELTER B / 45%</text></g>
        <g className="marker-pulse"><circle cx="600" cy="170" r="20" fill="none" stroke={shelterA?.status === 'FULL' ? '#ff4d5a' : '#ffab00'} strokeWidth="2" opacity="0.72" /><circle cx="600" cy="170" r="7" fill={shelterA?.status === 'FULL' ? '#ff4d5a' : '#ffab00'} filter="url(#danger-glow)" /><path d="M592 173 L600 163 L608 173 L608 181 L592 181 Z" fill="#f4f8fb" /><text x="616" y="175" fill={shelterA?.status === 'FULL' ? '#ff8b98' : '#ffd77a'} fontSize="12" fontFamily="JetBrains Mono">SHELTER A / {shelterA?.capacityPercent}%</text></g>
        <g className="marker-pulse"><circle cx="488" cy="252" r="14" fill="none" stroke="#ffab00" strokeWidth="2" opacity="0.58" /><circle cx="488" cy="252" r="5" fill="#ffab00" /><text x="504" y="257" fill="#ffd77a" fontSize="11" fontFamily="JetBrains Mono">SUPPLY DROP</text></g>
        {hasHazard && <g className="marker-pulse"><circle cx="338" cy="308" r="18" fill="none" stroke="#ff4d5a" strokeWidth="2" opacity="0.84" /><circle cx="338" cy="308" r="6" fill="#ff4d5a" filter="url(#danger-glow)" /><text x="352" y="302" fill="#ff8b98" fontSize="11" fontFamily="JetBrains Mono">HAZARD REPORT</text></g>}
        <g><circle cx="820" cy="350" r="12" fill="rgba(53,229,140,0.1)" stroke="#35e58c" /><path d="M815 350 h10 M820 345 v10" stroke="#35e58c" strokeWidth="2" /><text x="786" y="380" fill="#8af4b8" fontSize="11" fontFamily="JetBrains Mono">COMMUNITY</text></g>
        <g opacity="0.8"><path d="M72 286 h24 M84 274 v24" stroke="#35d9ff" strokeWidth="1" /><text x="52" y="316" fill="#8fa6b8" fontSize="10" fontFamily="JetBrains Mono">CHECKPOINT 02</text></g>
      </svg>
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        {(['A', 'B', 'C'] as RouteId[]).map((route) => (
          <button
            key={route}
            type="button"
            onClick={() => onRouteClick?.(route)}
            className={`flex items-center gap-2 border px-2.5 py-2 font-mono text-[0.6rem] font-semibold tracking-[0.12em] transition ${activeRoute === route ? 'border-cyan/70 bg-cyan/10 text-cyan' : 'border-white/10 bg-[#020813]/72 text-muted hover:border-white/30 hover:text-white'}`}
            aria-label={`Focus route ${route}`}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: toneForRisk(route === 'A' ? 'HIGH' : route === 'B' ? 'LOW' : 'MEDIUM'), boxShadow: `0 0 8px ${toneForRisk(route === 'A' ? 'HIGH' : route === 'B' ? 'LOW' : 'MEDIUM')}` }} />
            ROUTE {route}
          </button>
        ))}
      </div>
    </div>
  )
}
