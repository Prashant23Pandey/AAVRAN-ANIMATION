import { ArrowRight, AudioWaveform, CloudRain, Cpu, Power, Terminal } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StormAtmosphere } from '../components/effects/StormAtmosphere'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusPill } from '../components/ui/StatusPill'

const bootLines = [
  'KOZUI-X / KICKR CODEMANIA 2026',
  'REAL WORLD CONDITION LINK: READY',
  'AI EMERGENCY RESPONSE ENGINE: STANDBY',
  'SECTOR 04 FLOOD MODEL: LOADED',
]

export function LandingPage() {
  const navigate = useNavigate()
  const [booting, setBooting] = useState(false)

  const start = () => {
    setBooting(true)
    window.setTimeout(() => navigate('/setup'), 680)
  }

  return (
    <main className="screen-shell flex min-h-svh items-center justify-center px-4 py-8">
      <StormAtmosphere />
      <div className="content-layer relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-3"><div className="grid h-8 w-8 place-items-center border border-cyan/50 bg-cyan/5 text-cyan"><Power size={15} /></div><div><p className="eyebrow text-cyan">SYSTEM STATUS</p><p className="mono-value mt-1 text-xs font-semibold text-safe">ONLINE / SIMULATION READY</p></div></div>
          <StatusPill tone="amber">AI × REAL WORLD × GAMING</StatusPill>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="px-2 py-4 sm:px-6 lg:py-12">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow text-cyan">TRAIN. DECIDE. COORDINATE. RESPOND.</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="display-title mt-6 text-[clamp(3.25rem,10vw,7.6rem)] text-white">FLOOD<span className="text-cyan">//</span><br />SURVIVE</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="mt-7 max-w-md font-display text-xl font-medium uppercase leading-tight tracking-[0.02em] text-white/70 sm:text-2xl">The city is flooding.<br /><span className="text-amber">Your decisions matter.</span></motion.p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <GlowButton onClick={start} disabled={booting} icon={<ArrowRight size={16} />}>{booting ? 'INITIALIZING...' : 'DEPLOY RESPONDER'}</GlowButton>
              <span className="micro-copy flex items-center gap-2"><CloudRain size={13} className="text-cyan" /> WEATHER MODEL / HEAVY RAIN</span>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2 }} className="hud-panel corner-bracket overflow-hidden p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3"><span className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.14em] text-white"><Terminal size={14} className="text-cyan" /> FLOOD//KERNEL</span><span className="flex items-center gap-1.5 font-mono text-[0.58rem] text-safe"><span className="h-1.5 w-1.5 rounded-full bg-safe shadow-[0_0_9px_#35e58c]" /> LIVE</span></div>
            <div className="space-y-3 font-mono text-xs leading-6 text-muted">
              {bootLines.map((line, index) => <motion.p key={line} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.14 }}><span className="mr-2 text-cyan">{String(index + 1).padStart(2, '0')}</span>{line}</motion.p>)}
              <p className="text-white/85"><span className="mr-2 text-cyan">05</span>RAKSHAK AI: <span className="text-amber">AWAITING RESPONDER</span><span className="terminal-cursor" /></p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div className="border border-white/10 p-3"><Cpu size={15} className="text-cyan" /><p className="eyebrow mt-3">ENGINE</p><p className="mono-value mt-1 text-xs text-white">READY</p></div>
              <div className="border border-white/10 p-3"><AudioWaveform size={15} className="text-amber" /><p className="eyebrow mt-3">SIGNAL</p><p className="mono-value mt-1 text-xs text-white">LOCKED</p></div>
              <div className="border border-white/10 p-3"><CloudRain size={15} className="text-danger-soft" /><p className="eyebrow mt-3">RISK</p><p className="mono-value mt-1 text-xs text-danger-soft">HIGH</p></div>
            </div>
          </motion.div>
        </div>
        <AnimatePresence>{booting && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-20 grid place-items-center bg-[#020813]/95 backdrop-blur-sm"><div className="text-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-cyan border-t-transparent text-cyan"><Power size={18} /></motion.div><p className="eyebrow mt-5 text-cyan">HANDSHAKE / SURVIVAL PROTOCOL INITIALIZING</p></div></motion.div>}</AnimatePresence>
      </div>
    </main>
  )
}
