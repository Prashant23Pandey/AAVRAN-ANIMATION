import { Camera, Check, FileImage, ImagePlus, LoaderCircle, ScanLine, ShieldAlert, Trash2, UploadCloud } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { GameShell } from '../components/layout/GameShell'
import { Panel } from '../components/ui/Panel'
import { GlowButton } from '../components/ui/GlowButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'

export function ScannerPage() {
  const scannerStatus = useGameStore((state) => state.scannerStatus)
  const scanResult = useGameStore((state) => state.scanResult)
  const reports = useGameStore((state) => state.reports)
  const analyzeFloodImage = useGameStore((state) => state.analyzeFloodImage)
  const confirmScan = useGameStore((state) => state.confirmScan)
  const discardScan = useGameStore((state) => state.discardScan)
  const [previewName, setPreviewName] = useState('DEMO_IMAGE / ROAD_A.jpg')

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPreviewName(file.name.toUpperCase())
    void analyzeFloodImage(file, 'UPLOAD')
  }

  return (
    <GameShell title="FLOOD SCANNER" eyebrow="EMERGENCY AI VISION / VERIFIED HAZARD REPORTING">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel className="min-h-[440px]" eyebrow="SCOUT / REPORT ENVIRONMENT" title="AI-ASSISTED FLOOD VISION"><div className="flex h-full flex-col p-5 sm:p-7"><label htmlFor="flood-image" className="group relative flex min-h-[250px] flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-cyan/35 bg-cyan/[0.035] text-center transition hover:border-cyan hover:bg-cyan/[0.07]"><input id="flood-image" type="file" accept="image/*" className="sr-only" onChange={handleFile} /><div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(0,240,255,0.12), transparent 44%), linear-gradient(90deg, transparent 49%, rgba(0,240,255,0.25) 50%, transparent 51%)' }} /><div className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-cyan/50 bg-cyan/10 text-cyan shadow-[0_0_36px_rgba(0,240,255,0.16)]"><ScanLine size={28} className={scannerStatus === 'SCANNING' ? 'animate-pulse' : ''} /></div><p className="relative z-10 mt-5 font-mono text-xs font-semibold tracking-[0.12em] text-white">UPLOAD IMAGE OR USE DEMO SCAN</p><p className="micro-copy relative z-10 mt-2">Camera fallback enabled / no device access required</p></label><div className="mt-4 flex flex-wrap gap-2"><GlowButton variant="secondary" onClick={() => void analyzeFloodImage('demo-road-a', 'DEMO_IMAGE')} disabled={scannerStatus === 'SCANNING'} icon={<ImagePlus size={15} />}>USE DEMO IMAGE</GlowButton><label htmlFor="flood-image" className="glow-button glow-button-ghost cursor-pointer"><UploadCloud size={15} /><span>CHOOSE FILE</span></label></div></div></Panel>
        <div className="space-y-4"><Panel eyebrow="CLASSIFICATION PIPELINE" title="SCAN OUTPUT" right={<StatusPill tone={scannerStatus === 'SCANNING' ? 'amber' : scannerStatus === 'READY' ? 'cyan' : 'muted'}>{scannerStatus}</StatusPill>}><div className="p-5 sm:p-7"><div className="flex items-center gap-3 border-b border-white/10 pb-4"><FileImage size={17} className="text-cyan" /><div><p className="eyebrow">SOURCE</p><p className="mono-value mt-1 truncate text-xs text-white">{previewName}</p></div></div><AnimatePresence mode="wait">{scannerStatus === 'SCANNING' && <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 text-center"><LoaderCircle size={34} className="mx-auto animate-spin text-cyan" /><p className="eyebrow mt-5 text-cyan">ANALYZING IMAGE...</p><ProgressBar value={68} tone="cyan" className="mx-auto mt-5 max-w-sm" label="Image analysis progress" /><p className="micro-copy mt-3">Potential flood condition / image classification</p></motion.div>}{scannerStatus === 'IDLE' && !scanResult && <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center"><Camera size={31} className="mx-auto text-muted" /><p className="eyebrow mt-5">AWAITING IMAGE INPUT</p><p className="micro-copy mx-auto mt-2 max-w-xs">Use a demo image to preview the confirmation gate.</p></motion.div>}{scannerStatus === 'READY' && scanResult && <motion.div key="ready" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="pt-5"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-danger-soft">POTENTIAL FLOOD CONDITION</p><h2 className="display-title mt-2 text-3xl text-white">{scanResult.classification.replace('_', ' ')}</h2></div><div className="text-right"><p className="eyebrow">CONFIDENCE</p><p className="mono-value mt-1 text-2xl font-semibold text-cyan">{scanResult.confidence}%</p></div></div><p className="mt-5 text-sm leading-6 text-muted">{scanResult.summary}</p><div className="mt-5 flex items-start gap-3 border border-amber/30 bg-amber/5 p-4"><ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber" /><p className="micro-copy text-amber">AI-assisted classification only. This is not autonomous emergency decision-making.</p></div><p className="eyebrow mt-6 text-white">CONFIRM THIS REPORT?</p><div className="mt-3 flex flex-wrap gap-2"><GlowButton onClick={confirmScan} icon={<Check size={15} />}>CONFIRM</GlowButton><GlowButton variant="secondary" onClick={discardScan} icon={<Trash2 size={15} />}>DISCARD</GlowButton></div></motion.div>}</AnimatePresence></div></Panel><Panel eyebrow="VERIFIED REPORTS" title="MAP IMPACT"><div className="flex items-center justify-between gap-4 p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center border border-danger/35 bg-danger/10 text-danger-soft"><ShieldAlert size={18} /></div><div><p className="display-title text-2xl text-white">{reports.length.toString().padStart(2, '0')}</p><p className="eyebrow mt-1">CONFIRMED HAZARDS</p></div></div><Link to="/map" className="font-mono text-[0.62rem] font-semibold tracking-[0.1em] text-cyan hover:text-white">VIEW MAP →</Link></div></Panel></div>
      </div>
    </GameShell>
  )
}
