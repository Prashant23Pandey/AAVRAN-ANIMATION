import { disasterScenarios, type ActiveAlert, type DisasterScenario } from '../data/disasterScenarios'
import type { GameState } from '../types/game'

type EventCallback = (alert: ActiveAlert) => void

export class EventManager {
  private triggeredIds = new Set<string>()
  private activeAlerts: ActiveAlert[] = []
  private listeners: EventCallback[] = []
  private cooldownMs = 5000
  private lastTriggerTime = 0

  subscribe(callback: EventCallback): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  getActiveAlerts(): ActiveAlert[] {
    return this.activeAlerts.filter((alert) => !alert.dismissed)
  }

  dismissAlert(alertId: string) {
    const alert = this.activeAlerts.find((a) => a.scenario.id === alertId)
    if (alert) {
      alert.dismissed = true
    }
  }

  checkTriggers(state: GameState): void {
    const now = Date.now()
    if (now - this.lastTriggerTime < this.cooldownMs) return

    const sorted = [...disasterScenarios].sort((a, b) => a.priority - b.priority)

    for (const scenario of sorted) {
      if (this.triggeredIds.has(scenario.id)) continue
      if (!this.evaluateCondition(scenario, state)) continue

      this.triggeredIds.add(scenario.id)
      this.lastTriggerTime = now

      const activeAlert: ActiveAlert = {
        scenario,
        triggeredAt: now,
        dismissed: false,
      }
      this.activeAlerts.push(activeAlert)
      this.notifyListeners(activeAlert)
      break
    }
  }

  private evaluateCondition(scenario: DisasterScenario, state: GameState): boolean {
    const { type, value } = scenario.triggerCondition

    switch (type) {
      case 'floodLevel': {
        const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
        const required = levels.indexOf(value as string)
        const current = levels.indexOf(state.floodLevel)
        return current >= required
      }
      case 'roadBlocked': {
        const roadId = value as string
        return state.roads.some((road) => road.id === roadId && road.status === 'BLOCKED')
      }
      case 'shelterFull': {
        const shelterId = value as string
        return state.shelters.some((s) => s.id === shelterId && s.status === 'FULL')
      }
      case 'taskComplete': {
        const taskId = value as string
        return state.communityActionIds.includes(taskId)
      }
      case 'missionStatus': {
        return state.currentMission.status === value
      }
      case 'timeElapsed':
        return true
      case 'coordinate':
        return true
      default:
        return false
    }
  }

  private notifyListeners(alert: ActiveAlert) {
    for (const listener of this.listeners) {
      listener(alert)
    }
  }

  reset() {
    this.triggeredIds.clear()
    this.activeAlerts = []
    this.lastTriggerTime = 0
  }

  resetForNewScenario() {
    this.triggeredIds.clear()
    this.activeAlerts = []
    this.lastTriggerTime = 0
  }
}

export const eventManager = new EventManager()
