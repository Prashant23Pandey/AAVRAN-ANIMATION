import { Activity, CloudRain, Droplets, Radio, ShieldAlert } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { StormAtmosphere } from '../components/effects/StormAtmosphere'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'

const statuses = [
  { label: 'WEATHER', value: 'HEAVY RAIN', icon: CloudRain, tone: 'cyan' },
  { label: 'FLOOD RISK', value: 'HIGH', icon: ShieldAlert, tone: 'danger' },
  { label: 'WATER LEVEL', value: 'RISING', icon: Droplets, tone: 'amber' },
  { label: 'RAKSHAK AI', value: 'ONLINE', icon: Radio, tone: 'safe' },
] as const

const toneClasses = {
  cyan: 'text-cyan',
  danger: 'text-danger-soft',
  amber: 'text-amber',
  safe: 'text-safe',
} as const

export function BriefingPage() {
  const navigate = useNavigate()
  const hasStarted = useGameStore((state) => state.hasStarted)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => setReady(true), 1850)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!hasStarted) return <Navigate to="/setup" replace />

  return (
    <main className="screen-shell flex min-h-svh items-center justify-center px-4 py-10">
      <StormAtmosphere intense />
      <div className="content-layer w-full max-w-3xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div><p className="eyebrow text-cyan">RAKSHAK / EMERGENCY BRIEFING</p><h1 className="display-title mt-3 text-5xl text-white sm:text-7xl">DAY <span className="text-cyan">01</span></h1></div>
          <div className="text-right"><p className="eyebrow">LOCAL SIMULATION CLOCK</p><p className="mono-value mt-2 text-2xl font-semibold text-amber">07:15 PM</p></div>
        </div>
        <div className="hud-panel p-5 sm:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-2"><Activity size={16} className="text-cyan" /><span className="eyebrow text-cyan">INCOMING FIELD BRIEF</span></div><StatusPill tone="amber">ZONE 04</StatusPill></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {statuses.map(({ label, value, icon: Icon, tone }, index) => (
              <motion.div key={label} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + index * 0.25 }} className="border border-white/10 bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-muted"><Icon size={16} className={toneClasses[tone]} /><span className="eyebrow">{label}</span></div>
                <p className={`display-title mt-4 text-2xl ${toneClasses[tone]}`}>{value}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }} className="mt-7 border-l-2 border-cyan bg-cyan/5 px-4 py-4"><p className="eyebrow text-cyan">RAKSHAK</p><p className="mt-2 font-display text-xl font-medium leading-7 text-white">"Your emergency response deployment begins now."</p><p className="micro-copy mt-3">Real-world condition → AI analysis → game state → your decision.</p></motion.div>
          <div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center"><p className="micro-copy flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-safe shadow-[0_0_8px_#35e58c]" /> RAKSHAK LINK STABLE / MOCK AI MODE</p><GlowButton onClick={() => navigate('/survival')} disabled={!ready} icon={<Radio size={15} />}>{ready ? 'CONTINUE' : 'RECEIVING BRIEF...'}</GlowButton></div>
        </div>
      </div>
    </main>
  )
}
