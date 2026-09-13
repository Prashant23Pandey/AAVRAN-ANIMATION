import { Award, CheckCircle2, ChevronRight, Crown, Gauge, MapPinned, ShieldCheck, Sparkles, Star, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, Navigate } from 'react-router-dom'
import { GameShell } from '../components/layout/GameShell'
import { Panel } from '../components/ui/Panel'
import { GlowButton } from '../components/ui/GlowButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'

export function ResultsPage() {
  const mission = useGameStore((state) => state.currentMission)
  const player = useGameStore((state) => state.player)
  const achievements = useGameStore((state) => state.achievements)
  if (mission.status !== 'COMPLETE') return <Navigate to="/mission" replace />
  const scores = [
    { label: 'Safety Score', value: player.safetyScore, icon: ShieldCheck, tone: 'safe' as const },
    { label: 'Decision Quality', value: player.decisionScore, icon: Gauge, tone: 'cyan' as const },
    { label: 'Navigation', value: player.navigationScore, icon: MapPinned, tone: 'amber' as const },
    { label: 'Community', value: player.communityScore, icon: Users, tone: 'safe' as const },
  ]
  return (
    <GameShell title="EMERGENCY RESPONSE RESULTS" eyebrow="MISSION COMPLETE / SCORE DEBRIEF">
      <div className="mx-auto max-w-5xl"><motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="hud-panel hud-panel-safe overflow-hidden"><div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-safe/10 blur-3xl" /><div className="relative p-6 text-center sm:p-10"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-safe/45 bg-safe/10 text-safe shadow-[0_0_32px_rgba(53,229,140,0.2)]"><Crown size={30} /></div><p className="eyebrow mt-6 text-safe">FLOOD GUARDIAN / EMERGENCY OBJECTIVE SECURED</p><h1 className="display-title mt-3 text-5xl text-white sm:text-7xl">SURVIVAL<br /><span className="text-safe">COMPLETE</span></h1><p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted">You prioritized verified information, safer routes and community coordination during emergency response over dangerous shortcuts.</p><div className="mx-auto mt-8 flex w-fit items-center gap-3 border border-amber/35 bg-amber/10 px-4 py-3"><Star size={18} className="text-amber" /><div className="text-left"><p className="eyebrow text-amber">XP EARNED</p><p className="mono-value mt-1 text-xl font-semibold text-white">+{mission.rewardXp}</p></div></div></div><div className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">{scores.map(({ label, value, icon: Icon, tone }) => <div key={label} className="border-b border-white/10 p-5 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0"><div className="flex items-center justify-between gap-2"><span className="eyebrow">{label}</span><Icon size={15} className={tone === 'safe' ? 'text-safe' : tone === 'amber' ? 'text-amber' : 'text-cyan'} /></div><p className={`display-title mt-3 text-3xl ${tone === 'safe' ? 'text-safe' : tone === 'amber' ? 'text-amber' : 'text-cyan'}`}>{value}</p><ProgressBar value={value} tone={tone} className="mt-4" label={label} /></div>)}</div></motion.div><div className="mt-4 grid gap-4 md:grid-cols-[1fr_0.8fr]"><Panel eyebrow="PROGRESSION" title="LEVEL UP" tone="safe"><div className="flex items-center gap-4 p-5"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-cyan/45 bg-cyan/10 text-cyan"><Award size={25} /></div><div><p className="display-title text-2xl text-white">FLOOD GUARDIAN</p><p className="micro-copy mt-1">LEVEL {player.level} / SAFETY-FIRST SURVIVOR</p></div></div></Panel><Panel eyebrow="ACHIEVEMENTS" title="UNLOCKED"><div className="flex flex-wrap gap-2 p-5">{achievements.length ? achievements.map((achievement) => <StatusPill key={achievement} tone="safe"><CheckCircle2 size={12} /> {achievement}</StatusPill>) : <p className="micro-copy">Complete the next safe action to unlock badges.</p>}</div></Panel></div><div className="mt-5 flex flex-wrap justify-center gap-2"><GlowButton icon={<ChevronRight size={15} />}><Link to="/achievements">VIEW COMMUNITY LEADERBOARD</Link></GlowButton><GlowButton variant="secondary" icon={<Sparkles size={15} />}><Link to="/survival">RETURN TO HUD</Link></GlowButton></div></div>
    </GameShell>
  )
}
