import { AlertOctagon, BatteryCharging, CloudLightning, Droplets, Flame, Home, Radio, RotateCcw, Siren, Zap } from 'lucide-react'
import { GameShell } from '../components/layout/GameShell'
import { LazyWaterTelemetryChart } from '../components/charts/LazyWaterTelemetryChart'
import { Panel } from '../components/ui/Panel'
import { GlowButton } from '../components/ui/GlowButton'
import { StatusPill } from '../components/ui/StatusPill'
import { useGameStore } from '../store/gameStore'
import type { DemoControl, FloodLevel, RoadStatus, ShelterStatus, WeatherLevel } from '../types/game'

const weatherOptions: WeatherLevel[] = ['LOW', 'MODERATE', 'HEAVY', 'EXTREME']
const floodOptions: FloodLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const roadOptions: RoadStatus[] = ['OPEN', 'CAUTION', 'BLOCKED']
const shelterOptions: ShelterStatus[] = ['AVAILABLE', 'BUSY', 'FULL']

function updateSelectControl(
  key: string,
  value: string,
  setDemoControl: (control: DemoControl) => Promise<void>,
) {
  switch (key) {
    case 'weather': return setDemoControl({ weather: value as WeatherLevel })
    case 'floodLevel': return setDemoControl({ floodLevel: value as FloodLevel })
    case 'roadA': return setDemoControl({ roadA: value as RoadStatus })
    case 'roadB': return setDemoControl({ roadB: value as RoadStatus })
    case 'shelterA': return setDemoControl({ shelterA: value as ShelterStatus })
    case 'shelterB': return setDemoControl({ shelterB: value as ShelterStatus })
    default: return Promise.resolve()
  }
}

export function DemoPage() {
  const state = useGameStore()
  const setDemoControl = state.setDemoControl
  const simulate = state.simulateFloodEscalation
  const resetGame = state.resetGame
  const isThinking = state.isAiThinking
  const controls = [
    { label: 'RAINFALL', value: state.weather, options: weatherOptions, key: 'weather', icon: CloudLightning },
    { label: 'FLOOD LEVEL', value: state.floodLevel, options: floodOptions, key: 'floodLevel', icon: Droplets },
    { label: 'ROAD A', value: state.roads[0]?.status, options: roadOptions, key: 'roadA', icon: Radio },
    { label: 'ROAD B', value: state.roads[1]?.status, options: roadOptions, key: 'roadB', icon: Radio },
    { label: 'SHELTER A', value: state.shelters[0]?.status, options: shelterOptions, key: 'shelterA', icon: Home },
    { label: 'SHELTER B', value: state.shelters[1]?.status, options: shelterOptions, key: 'shelterB', icon: Home },
  ]

  return (
    <GameShell title="EMERGENCY DEMO MODE" eyebrow="SIMULATION CONTROL / LIVE STATE MUTATION">
      <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <Panel className="hazard-stripes" eyebrow="DEMO CONTROL" title="SIMULATE REAL-WORLD CONDITIONS" tone="danger">
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3 border border-danger/30 bg-danger/5 p-4">
                <AlertOctagon size={18} className="mt-0.5 shrink-0 text-danger-soft" />
                <div>
                  <p className="eyebrow text-danger-soft">SIMULATED DATA / NOT EMERGENCY INSTRUCTIONS</p>
                  <p className="mt-2 text-sm leading-6 text-white/80">Change inputs and watch AI analysis, route recommendations, shelter capacity, battery mode and mission copy update live.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {controls.map(({ label, value, options, key, icon: Icon }) => (
                  <label key={label} className="field-shell">
                    <span className="flex items-center gap-2"><Icon size={13} className="text-cyan" />{label}</span>
                    <select value={value ?? ''} onChange={(event) => void updateSelectControl(key, event.target.value, setDemoControl)}>
                      {options.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="field-shell">
                  <span className="flex items-center gap-2"><UsersIcon />COMMUNITY REPORTS</span>
                  <select value={state.community.unverified} onChange={(event) => void setDemoControl({ communityReports: Number(event.target.value) })}>
                    {[0, 1, 2, 5, 6].map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </label>
                <label className="field-shell">
                  <span className="flex items-center gap-2"><BatteryCharging size={13} className="text-cyan" />PLAYER BATTERY</span>
                  <select value={state.player.battery} onChange={(event) => void setDemoControl({ playerBattery: Number(event.target.value) })}>
                    {[100, 68, 50, 20, 5].map((value) => <option key={value} value={value}>{value}%</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-6 flex flex-col gap-3 border-t border-danger/20 pt-5 sm:flex-row">
                <GlowButton variant="danger" className="flex-1" onClick={() => void simulate()} disabled={isThinking || state.escalationActive} icon={<Siren size={16} />}>
                  {state.escalationActive ? 'ESCALATION ACTIVE' : 'SIMULATE FLOOD ESCALATION'}
                </GlowButton>
                <GlowButton variant="ghost" onClick={resetGame} icon={<RotateCcw size={15} />}>RESET</GlowButton>
              </div>
            </div>
          </Panel>
          <Panel eyebrow="ESCALATION SCRIPT" title="THREE-STAGE LIVE EVENT">
            <div className="space-y-4 p-5">
              {[
                { step: '01', title: 'DARKEN / LIGHTNING', detail: 'Screen state shifts into emergency mode.', icon: Zap },
                { step: '02', title: 'ROAD A BLOCKED', detail: 'Flood risk goes critical. Shelter A reaches 95% full.', icon: Flame },
                { step: '03', title: 'MISSION REGENERATED', detail: 'RAKSHAK plots Shelter B and updates the objective.', icon: Radio },
              ].map(({ step, title, detail, icon: Icon }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="mono-value mt-1 w-6 text-xs text-amber">{step}</div>
                  <div className="grid h-8 w-8 shrink-0 place-items-center border border-amber/30 bg-amber/5 text-amber"><Icon size={15} /></div>
                  <div><p className="text-sm font-semibold text-white">{title}</p><p className="micro-copy mt-1">{detail}</p></div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel eyebrow="AI EMERGENCY ENGINE" title="LIVE STATE READOUT" right={<StatusPill tone={isThinking ? 'amber' : state.escalationActive ? 'danger' : 'cyan'}>{isThinking ? 'ANALYZING' : 'LISTENING'}</StatusPill>}>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div className="border border-white/10 bg-white/[0.025] p-4"><p className="eyebrow">CURRENT MISSION</p><p className="display-title mt-3 text-2xl text-white">{state.currentMission.title}</p><p className="micro-copy mt-2">{state.currentMission.description}</p></div>
              <div className="border border-white/10 bg-white/[0.025] p-4"><p className="eyebrow">RAKSHAK RESPONSE</p><p className="mt-3 text-sm leading-6 text-white/80">{state.aiMessage}</p></div>
            </div>
            <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-3">
              <div><p className="eyebrow">WEATHER</p><p className="mono-value mt-2 text-lg text-cyan">{state.weather}</p></div>
              <div><p className="eyebrow">FLOOD</p><p className="mono-value mt-2 text-lg text-danger-soft">{state.floodLevel}</p></div>
              <div><p className="eyebrow">ROUTE</p><p className="mono-value mt-2 text-lg text-safe">{state.recommendedRoute}</p></div>
            </div>
          </Panel>
          <Panel eyebrow="TELEMETRY" title="WATER LEVEL / RISK"><div className="p-4"><LazyWaterTelemetryChart data={state.floodTimeline} /></div></Panel>
          <Panel eyebrow="WHY THIS MATTERS" title="AI MUST CHANGE THE EMERGENCY RESPONSE">
            <div className="p-5"><div className="flex items-start gap-3"><Siren size={17} className="mt-0.5 text-danger-soft" /><p className="text-sm leading-6 text-muted">Without the AI engine, the emergency mission would not regenerate, routes would not adapt, and the demo controls would not change the decision context. Every output is deterministic mock data behind a replaceable service interface.</p></div></div>
          </Panel>
        </div>
      </div>
    </GameShell>
  )
}

function UsersIcon() {
  return <span className="inline-flex h-[13px] w-[13px] items-center justify-center text-cyan">👥</span>
}
