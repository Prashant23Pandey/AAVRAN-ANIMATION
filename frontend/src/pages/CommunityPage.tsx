import { Check, CheckCircle2, HandHeart, Info, Megaphone, Radio, ShieldCheck, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { GameShell } from '../components/layout/GameShell'
import { Panel } from '../components/ui/Panel'
import { GlowButton } from '../components/ui/GlowButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'

const actions = [
  { id: 'verify-report', label: 'Verify emergency report', description: 'Review an unverified field signal before it affects the emergency response group.', icon: ShieldCheck, reward: '+25 XP' },
  { id: 'share-alert', label: 'Share verified emergency alert', description: 'Broadcast an AI-checked warning to the local community during disaster response.', icon: Megaphone, reward: '+25 XP' },
  { id: 'preparedness', label: 'Complete emergency preparedness mission', description: 'Help a citizen check resources and keep the evacuation route clear.', icon: HandHeart, reward: '+25 XP' },
  { id: 'check-buddy', label: 'Check registered buddy status', description: 'Confirm a buddy status without entering any hazard zone during emergency operations.', icon: Radio, reward: '+25 XP' },
]

export function CommunityPage() {
  const community = useGameStore((state) => state.community)
  const completedActions = useGameStore((state) => state.communityActionIds)
  const completeAction = useGameStore((state) => state.completeCommunityAction)
  const progress = (community.safe / community.targetSafe) * 100
  return (
    <GameShell title="COMMUNITY EVACUATION" eyebrow="ZONE 04 / EMERGENCY COORDINATION NETWORK">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4"><Panel className="relative overflow-hidden" eyebrow="COMMUNITY OBJECTIVE" title="EVACUATE 30 CITIZENS TO SAFETY" tone="safe"><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-safe/10 blur-3xl" /><div className="relative p-5 sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="display-title text-6xl text-white">{community.safe}<span className="text-muted">/{community.targetSafe}</span></p><p className="eyebrow mt-2 text-safe">SAFE / VERIFIED EVACUATION</p></div><div className="text-left sm:text-right"><p className="eyebrow">TOTAL SIGNALS</p><p className="mono-value mt-1 text-2xl font-semibold text-white">{community.total}</p></div></div><ProgressBar value={progress} tone="safe" className="mt-6" label="Community progress" /><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[
          { label: 'SAFE', value: community.safe, tone: 'text-safe' },
          { label: 'EVACUATING', value: community.evacuating, tone: 'text-amber' },
          { label: 'UNVERIFIED', value: community.unverified, tone: 'text-danger-soft' },
          { label: 'NEED INFO', value: community.needsInformation, tone: 'text-cyan' },
        ].map((item) => <div key={item.label} className="border border-white/10 bg-white/[0.025] p-3"><p className="eyebrow">{item.label}</p><p className={`mono-value mt-2 text-xl font-semibold ${item.tone}`}>{item.value.toString().padStart(2, '0')}</p></div>)}</div></div></Panel><Panel eyebrow="SAFE ACTIONS" title="COORDINATE / DO NOT RISK"><div className="divide-y divide-white/10">{actions.map(({ id, label, description, icon: Icon, reward }) => { const done = completedActions.includes(id); return <motion.div layout key={id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center border ${done ? 'border-safe/45 bg-safe/10 text-safe' : 'border-cyan/30 bg-cyan/5 text-cyan'}`}>{done ? <Check size={16} /> : <Icon size={16} />}</div><div><p className={`text-sm font-semibold ${done ? 'text-safe' : 'text-white'}`}>{label}</p><p className="micro-copy mt-1 max-w-lg">{description}</p></div></div><div className="flex items-center gap-3 sm:shrink-0"><span className="mono-value text-xs text-amber">{reward}</span><GlowButton variant={done ? 'ghost' : 'secondary'} onClick={() => completeAction(id)} disabled={done} icon={done ? <CheckCircle2 size={14} /> : undefined}>{done ? 'COMPLETE' : 'LOG ACTION'}</GlowButton></div></motion.div>})}</div></Panel></div>
        <aside className="space-y-4"><Panel eyebrow="COMMUNITY SIGNAL" title="ZONE 04 / STATUS"><div className="p-5"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full border border-safe/40 bg-safe/10 text-safe"><Users size={21} /></div><div><p className="font-display text-xl font-semibold text-white">COMMUNITY LINK STABLE</p><p className="micro-copy mt-1">47 survivor signals / 24 confirmed safe</p></div></div><div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5"><Info size={16} className="mt-0.5 shrink-0 text-cyan" /><p className="micro-copy">Actions add progress only when they reduce uncertainty or improve preparedness during emergency response. No dangerous rescue scoring.</p></div></div></Panel><Panel eyebrow="RAKSHAK DIRECTIVE" title="SHARED SAFETY"><div className="p-5"><p className="text-sm leading-6 text-white/80">"Use verified information. Keep the group moving toward higher ground during emergency evacuation. If a report is uncertain, confirm it before acting."</p><div className="mt-5 border-t border-white/10 pt-4"><StatusPill tone="safe">HUMAN CONFIRMATION REQUIRED</StatusPill></div></div></Panel></aside>
      </div>
    </GameShell>
  )
}
