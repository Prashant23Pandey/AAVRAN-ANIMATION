import { Award, Check, Crown, Medal, ShieldCheck, Star, Trophy, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { GameShell } from '../components/layout/GameShell'
import { Panel } from '../components/ui/Panel'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'

const achievementList = [
  { id: 'FIRST SURVIVAL', label: 'FIRST SURVIVAL', detail: 'Complete first mission.', icon: ShieldCheck },
  { id: 'SAFE DECISION MAKER', label: 'SAFE DECISION MAKER', detail: 'Choose the safer route.', icon: Check },
  { id: 'COMMUNITY HELPER', label: 'COMMUNITY HELPER', detail: 'Complete three community actions.', icon: Users },
  { id: 'HAZARD REPORTER', label: 'HAZARD REPORTER', detail: 'Submit a verified hazard.', icon: Award },
  { id: 'FLOOD GUARDIAN', label: 'FLOOD GUARDIAN', detail: 'Complete a high-risk scenario safely.', icon: Crown },
]

const leaderboard = [
  { rank: '#1', name: 'SAFE NAVIGATOR', score: 982, reports: 14, icon: Trophy },
  { rank: '#2', name: 'FLOOD GUARDIAN', score: 941, reports: 11, icon: Crown },
  { rank: '#3', name: 'COMMUNITY HELPER', score: 918, reports: 18, icon: Users },
  { rank: '#4', name: 'SIGNAL KEEPER', score: 887, reports: 9, icon: Medal },
]

export function AchievementsPage() {
  const achievements = useGameStore((state) => state.achievements)
  const player = useGameStore((state) => state.player)
  return (
    <GameShell title="ACHIEVEMENTS" eyebrow="PROGRESSION / EMERGENCY RESPONSE LEADERBOARD">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
        <Panel eyebrow="SURVIVOR PROFILE" title={player.name}><div className="p-5 sm:p-7"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full border border-cyan/40 bg-cyan/10 text-cyan"><Star size={25} /></div><div><p className="display-title text-3xl text-white">LEVEL {player.level}</p><p className="micro-copy mt-1">{player.xp} XP / SAFETY INDEX {player.safetyScore}</p></div></div><div className="mt-7 space-y-3">{achievementList.map(({ id, label, detail, icon: Icon }) => { const unlocked = achievements.includes(id); return <motion.div layout key={id} className={`flex items-center gap-3 border p-3 ${unlocked ? 'border-safe/35 bg-safe/5' : 'border-white/10 bg-white/[0.02] opacity-60'}`}><div className={`grid h-9 w-9 place-items-center border ${unlocked ? 'border-safe/40 text-safe' : 'border-white/10 text-muted'}`}><Icon size={16} /></div><div className="min-w-0"><p className={`text-xs font-semibold tracking-[0.08em] ${unlocked ? 'text-white' : 'text-muted'}`}>{label}</p><p className="micro-copy mt-1 truncate">{detail}</p></div><StatusPill tone={unlocked ? 'safe' : 'muted'} dot={false}>{unlocked ? 'UNLOCKED' : 'LOCKED'}</StatusPill></motion.div>})}</div></div></Panel>
        <Panel eyebrow="COMMUNITY SAFETY" title="LEADERBOARD"><div className="border-b border-white/10 p-5"><div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center border border-amber/35 bg-amber/10 text-amber"><Trophy size={18} /></div><div><p className="text-sm font-semibold text-white">Ranked by safety, not risk.</p><p className="micro-copy mt-1">Decision quality, verified reports and preparedness during emergency response.</p></div></div></div><div className="divide-y divide-white/10">{leaderboard.map(({ rank, name, score, reports, icon: Icon }) => <div key={rank} className="flex items-center gap-3 p-5"><span className="mono-value w-7 text-sm font-semibold text-amber">{rank}</span><div className="grid h-9 w-9 place-items-center border border-white/10 bg-white/[0.025] text-cyan"><Icon size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{name}</p><p className="micro-copy mt-1">{reports} VERIFIED REPORTS / PREPAREDNESS ACTIVE</p></div><div className="text-right"><p className="mono-value text-lg font-semibold text-cyan">{score}</p><p className="eyebrow">SAFETY</p></div></div>)}</div><div className="border-t border-white/10 p-5"><div className="flex items-center justify-between gap-3"><span className="eyebrow">YOUR PROJECTED RANK</span><span className="mono-value text-sm text-safe">#12 / EMERGENCY RESPONSE INDEX {player.safetyScore}</span></div></div></Panel>
      </div>
    </GameShell>
  )
}
