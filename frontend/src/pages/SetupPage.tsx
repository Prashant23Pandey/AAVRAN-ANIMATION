import { Check, ChevronRight, Droplets, Flashlight, HeartPulse, Package, Users, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlowButton } from '../components/ui/GlowButton'
import { Panel } from '../components/ui/Panel'
import { useGameStore } from '../store/gameStore'
import type { SurvivorProfile } from '../types/game'

const resourceOptions = [
  { key: 'water', label: 'Water', icon: Droplets },
  { key: 'food', label: 'Food', icon: Package },
  { key: 'firstAid', label: 'First Aid', icon: HeartPulse },
  { key: 'flashlight', label: 'Flashlight', icon: Flashlight },
  { key: 'powerbank', label: 'Powerbank', icon: Zap },
] as const

type ResourceKey = (typeof resourceOptions)[number]['key']

export function SetupPage() {
  const navigate = useNavigate()
  const initializeSurvival = useGameStore((state) => state.initializeSurvival)
  const [profile, setProfile] = useState<SurvivorProfile>({ name: '', companions: 1, preparedness: 'BASIC', water: true, food: true, firstAid: true, flashlight: true, powerbank: true })
  const [error, setError] = useState('')

  const toggle = (key: ResourceKey) => setProfile((current) => ({ ...current, [key]: !current[key] }))
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (profile.name.trim().length < 2) {
      setError('Enter at least two characters for your responder call sign.')
      return
    }
    setError('')
    initializeSurvival(profile)
    navigate('/briefing')
  }

  return (
    <main className="screen-shell flex min-h-svh items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="content-layer mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[0.65fr_1.35fr] lg:items-center">
        <div className="px-1 py-4 sm:px-4 lg:py-12"><p className="eyebrow text-cyan">RESPONDER INTAKE / STEP 01</p><h1 className="display-title mt-4 text-4xl text-white sm:text-5xl">IDENTIFY<br /><span className="text-cyan">YOUR RESPONDER</span></h1><p className="mt-5 max-w-sm text-sm leading-6 text-muted">RAKSHAK uses your simulated loadout and group size to adapt emergency mission difficulty. No sensitive personal data is required.</p><div className="mt-8 flex items-center gap-3 text-muted"><Users size={17} className="text-cyan" /><span className="micro-copy">GROUP SAFETY / LOCAL DEMO PROFILE</span></div></div>
        <Panel className="p-5 sm:p-7" eyebrow="PROFILE CONFIGURATION" title="LOADOUT YOUR EMERGENCY STATE" right={<span className="font-mono text-[0.6rem] text-cyan">01 / 03</span>}>
          <form onSubmit={submit} className="p-0 sm:p-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field-shell sm:col-span-2"><label htmlFor="survivor-name">Responder call sign</label><input id="survivor-name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="e.g. NIGHTWATCH" autoComplete="nickname" aria-describedby={error ? 'setup-error' : undefined} />{error && <p id="setup-error" className="font-mono text-xs text-danger-soft" role="alert">{error}</p>}</div>
              <div className="field-shell"><label htmlFor="companions">Number of people with you</label><select id="companions" value={profile.companions} onChange={(event) => setProfile({ ...profile, companions: Number(event.target.value) })}>{[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value} {value === 1 ? 'person' : 'people'}</option>)}</select></div>
              <div className="field-shell"><label htmlFor="preparedness">Basic preparedness</label><select id="preparedness" value={profile.preparedness} onChange={(event) => setProfile({ ...profile, preparedness: event.target.value as SurvivorProfile['preparedness'] })}><option value="BASIC">Basic / improvised</option><option value="PREPARED">Prepared / balanced</option><option value="ADVANCED">Advanced / disciplined</option></select></div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-5"><div className="mb-3 flex items-center justify-between"><p className="eyebrow">OPTIONAL STARTING RESOURCES</p><span className="micro-copy">GAME MECHANICS ONLY</span></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{resourceOptions.map(({ key, label, icon: Icon }) => <button key={key} type="button" className="toggle-chip" data-active={profile[key]} onClick={() => toggle(key)} aria-pressed={profile[key]}><span className="flex items-center gap-2"><Icon size={15} className={profile[key] ? 'text-cyan' : 'text-muted'} />{label}</span><span className="toggle-indicator" aria-hidden="true">{profile[key] && <Check size={10} className="text-[#020813]" />}</span></button>)}</div></div>
            <motion.div className="mt-7 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>              <p className="micro-copy max-w-xs"><span className="text-safe">PRIVACY:</span> all values stay in this local simulation and can be reset in settings.</p><GlowButton type="submit" icon={<ChevronRight size={16} />}>DEPLOY RESPONDER</GlowButton></motion.div>
          </form>
        </Panel>
      </div>
    </main>
  )
}
