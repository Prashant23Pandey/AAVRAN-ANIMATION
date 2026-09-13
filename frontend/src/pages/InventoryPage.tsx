import { BatteryCharging, Check, Droplets, Flashlight, HeartPulse, Package, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { GameShell } from '../components/layout/GameShell'
import { Panel } from '../components/ui/Panel'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'
import type { PlayerState } from '../types/game'

const itemConfig = [
  { key: 'water', label: 'Water', helper: 'Ration', icon: Droplets, tone: 'text-cyan' },
  { key: 'food', label: 'Food', helper: 'Ration', icon: Package, tone: 'text-amber' },
  { key: 'firstAid', label: 'First Aid', helper: 'Game mechanic', icon: HeartPulse, tone: 'text-danger-soft' },
  { key: 'flashlight', label: 'Flashlight', helper: 'Night navigation', icon: Flashlight, tone: 'text-amber' },
  { key: 'powerbank', label: 'Powerbank', helper: 'Battery restore', icon: Zap, tone: 'text-safe' },
] as const

type ItemKey = (typeof itemConfig)[number]['key']

export function InventoryPage() {
  const player = useGameStore((state) => state.player)
  const activateItem = useGameStore((state) => state.useInventoryItem)

  return (
    <GameShell title="EMERGENCY KIT" eyebrow="INVENTORY / EMERGENCY RESOURCE MECHANICS">
      <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <Panel eyebrow="LOADOUT" title="FIELD INVENTORY">
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            {itemConfig.map(({ key, label, helper, icon: Icon, tone }) => {
              const amount = player[key as keyof PlayerState] as number
              return (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => activateItem(key as ItemKey)}
                  className="group relative overflow-hidden border border-white/10 bg-white/[0.025] p-4 text-left transition hover:border-cyan/45 hover:bg-cyan/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`grid h-11 w-11 place-items-center border border-white/10 bg-[#020813]/60 ${tone}`}>
                      <Icon size={20} />
                    </div>
                    <span className="mono-value text-2xl font-semibold text-white">{amount}</span>
                  </div>
                  <p className="mt-5 font-display text-lg font-semibold tracking-[0.04em] text-white">{label}</p>
                  <p className="micro-copy mt-1">{helper.toUpperCase()}</p>
                  <div className="mt-4 flex items-center gap-1.5 font-mono text-[0.58rem] tracking-[0.12em] text-muted opacity-0 transition group-hover:opacity-100">
                    <Check size={12} className="text-safe" /> ACTIVATE ITEM
                  </div>
                </motion.button>
              )
            })}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel eyebrow="SIMULATED RESOURCE" title="BATTERY RESERVE" tone={player.battery < 20 ? 'danger' : 'default'}>
            <div className="p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className={`display-title text-6xl ${player.battery < 20 ? 'text-danger-soft' : 'text-cyan'}`}>
                    {player.battery}<span className="text-2xl">%</span>
                  </p>
                  <p className="eyebrow mt-2">{player.battery < 20 ? 'EMERGENCY MODE ACTIVE' : 'POWER REMAINING'}</p>
                </div>
                <BatteryCharging size={30} className={player.battery < 20 ? 'text-danger-soft' : 'text-cyan'} />
              </div>
              <ProgressBar value={player.battery} tone={player.battery < 20 ? 'danger' : 'cyan'} className="mt-6" label="Battery" />
              <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                <div className="flex justify-between"><span className="micro-copy">MAP REFRESH</span><span className="mono-value text-xs text-muted">-2%</span></div>
                <div className="flex justify-between"><span className="micro-copy">CAMERA SCAN</span><span className="mono-value text-xs text-muted">-5%</span></div>
                <div className="flex justify-between"><span className="micro-copy">AI INTERACTION</span><span className="mono-value text-xs text-muted">-2%</span></div>
              </div>
            </div>
          </Panel>
          <Panel eyebrow="RESOURCE SAFETY" title="GAME MECHANICS">
            <div className="p-5">
              <StatusPill tone="amber">SIMULATED DATA</StatusPill>
              <p className="mt-4 text-sm leading-6 text-muted">Inventory items are game mechanics for this prototype. They are not medical or emergency instructions.</p>
            </div>
          </Panel>
        </div>
      </div>
    </GameShell>
  )
}
