import { BatteryCharging, Droplets, HeartPulse, PackageOpen, Radio, Settings2, Star, Utensils, Waves, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useGameStore } from '../../store/gameStore'
import { MobileBottomNav } from './MobileBottomNav'
import { StatusPill } from '../ui/StatusPill'
import { StatValue } from '../ui/StatValue'

interface GameShellProps {
  children: ReactNode
  title?: string
  eyebrow?: string
  compact?: boolean
}

const desktopLinks = [
  { to: '/survival', label: 'RESPONSE HUD' },
  { to: '/map', label: 'TACTICAL MAP' },
  { to: '/mission', label: 'MISSION DECK' },
  { to: '/scanner', label: 'FLOOD SCANNER' },
  { to: '/community', label: 'COMMUNITY' },
]

export function GameShell({ children, title = 'SURVIVAL HUD', eyebrow = 'ZONE 04 / LOWER EAST', compact = false }: GameShellProps) {
  const { pathname } = useLocation()
  const player = useGameStore((state) => state.player)
  const weather = useGameStore((state) => state.weather)
  const floodLevel = useGameStore((state) => state.floodLevel)
  const aiStatus = useGameStore((state) => state.aiStatus)
  const demoMode = useGameStore((state) => state.demoMode)
  const setDemoMode = useGameStore((state) => state.setDemoMode)

  const isDanger = floodLevel === 'CRITICAL' || floodLevel === 'HIGH'
  return (
    <div className="screen-shell">
      <header className="content-layer sticky top-0 z-20 border-b border-white/10 bg-[#020813]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/survival" className="min-w-0">
            <p className="eyebrow text-cyan">KOZUI-X / KICKR CODEMANIA 2026</p>
            <p className="display-title mt-1 truncate text-lg text-white sm:text-xl">FLOOD<span className="text-cyan">//</span>SURVIVE</p>
          </Link>
          <div className="hidden items-center gap-4 lg:flex">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `font-mono text-[0.62rem] font-semibold tracking-[0.11em] transition ${isActive ? 'text-cyan' : 'text-muted hover:text-white'}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className={`hidden items-center gap-2 rounded border px-2.5 py-2 font-mono text-[0.58rem] font-semibold tracking-[0.1em] transition sm:flex ${demoMode ? 'border-amber/40 bg-amber/10 text-amber' : 'border-white/10 text-muted hover:border-cyan/50 hover:text-cyan'}`}
            >
              <Zap size={13} aria-hidden="true" />
              {demoMode ? 'SIMULATED DATA' : 'LIVE LABEL OFF'}
            </button>
            <Link to="/settings" className="grid h-9 w-9 place-items-center border border-white/10 text-muted transition hover:border-cyan/60 hover:text-cyan" aria-label="Open settings">
              <Settings2 size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main className={`content-layer mx-auto max-w-[1500px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 ${compact ? '' : 'lg:pt-7'}`}>
        <div className="mb-5 flex flex-col justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-cyan">{eyebrow}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="display-title text-2xl text-white sm:text-3xl">{title}</h1>
              {demoMode && <StatusPill tone="amber">Simulated data</StatusPill>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isDanger ? 'bg-danger shadow-[0_0_12px_rgba(229,43,80,0.8)]' : 'bg-safe shadow-[0_0_12px_rgba(53,229,140,0.8)]'}`} aria-hidden="true" />
              <span className="mono-value text-xs font-semibold text-muted">{weather} RAIN / FLOOD {floodLevel}</span>
            </div>
            <span className="hidden text-white/15 sm:inline">|</span>
            <div className="flex items-center gap-4">
              <StatValue label="Health" value={`${player.health}%`} icon={<HeartPulse size={15} />} tone={player.health < 50 ? 'danger' : 'safe'} />
              <StatValue label="Battery" value={`${player.battery}%`} icon={<BatteryCharging size={15} />} tone={player.battery < 20 ? 'danger' : 'cyan'} />
              <StatValue label="XP" value={player.xp} icon={<Star size={15} />} tone="amber" />
            </div>
          </div>
        </div>
        {pathname !== '/settings' && <div className="sr-only" aria-live="polite">RAKSHAK status: {aiStatus}</div>}
        {children}
      </main>

      <footer className="content-layer desktop-only bottom-dock fixed inset-x-4 bottom-4 z-20 mx-auto max-w-[1500px] rounded px-4 py-3 lg:inset-x-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex shrink-0 items-center gap-2 border-r border-white/10 pr-4">
              <Waves size={18} className="text-cyan" aria-hidden="true" />
              <div>
                <p className="eyebrow">EMERGENCY CONDITION</p>
                <p className="mono-value mt-0.5 text-xs font-semibold text-white">{floodLevel} / {weather}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted">
              <div className="flex items-center gap-1.5" title="Water rations"><Droplets size={14} className="text-cyan" /><span className="mono-value text-xs">{player.water}</span></div>
              <div className="flex items-center gap-1.5" title="Food rations"><Utensils size={14} className="text-amber" /><span className="mono-value text-xs">{player.food}</span></div>
              <div className="flex items-center gap-1.5" title="Inventory"><PackageOpen size={14} className="text-safe" /><span className="mono-value text-xs">{player.firstAid + player.flashlight + player.powerbank}</span></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="eyebrow hidden xl:block">{player.name} / LVL {player.level}</span>
            <StatusPill tone={aiStatus === 'WARNING' ? 'danger' : aiStatus === 'SUCCESS' ? 'safe' : 'cyan'}>{aiStatus.replace('_', ' ')}</StatusPill>
            <Link to="/demo" className="flex items-center gap-2 border border-danger/50 bg-danger/10 px-3 py-2 font-mono text-[0.6rem] font-semibold tracking-[0.12em] text-danger-soft transition hover:bg-danger/20">
              <Radio size={13} aria-hidden="true" /> DEMO CONTROL
            </Link>
          </div>
        </div>
      </footer>
      <MobileBottomNav />
    </div>
  )
}
