import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createInitialState, createInitialTrainingState } from '../data/mockData'
import { mockAiService } from '../services/aiService'
import { eventManager } from '../services/eventManager'
import type {
  AiDecisionOutput,
  DemoControl,
  EventType,
  GameEvent,
  GameSettings,
  GameState,
  RouteId,
  SurvivorProfile,
  TrainingFeedback,
  TrainingItemId,
  TrainingModuleId,
} from '../types/game'

export interface GameActions {
  initializeSurvival: (profile: SurvivorProfile) => void
  acceptMission: () => void
  followRoute: (routeId?: RouteId) => void
  chooseRoute: (routeId: RouteId) => Promise<void>
  analyzeFloodImage: (input: string | File, source: 'DEMO_IMAGE' | 'UPLOAD') => Promise<void>
  confirmScan: () => void
  discardScan: () => void
  completeCommunityAction: (actionId: string) => void
  useInventoryItem: (item: 'water' | 'food' | 'firstAid' | 'flashlight' | 'powerbank') => void
  setDemoControl: (control: DemoControl) => Promise<void>
  simulateFloodEscalation: () => Promise<void>
  completeMission: () => void
  setTrainingModule: (moduleId: TrainingModuleId) => void
  selectTrainingRisk: (choiceId: string) => void
  selectTrainingRoute: (routeId: RouteId) => void
  toggleTrainingItem: (itemId: TrainingItemId) => void
  evaluateTrainingRisk: () => Promise<void>
  evaluateTrainingRoute: () => Promise<void>
  evaluateTrainingPreparedness: () => Promise<void>
  practiceTrainingAgain: () => void
  setSettings: (settings: Partial<GameSettings>) => void
  setDemoMode: (enabled: boolean) => void
  resetGame: () => void
  checkDisasterTriggers: () => void
  dismissDisasterAlert: (alertId: string) => void
}

export type GameStore = GameState & GameActions

const timestamp = () =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

const makeEvent = (type: EventType, title: string, detail: string): GameEvent => ({
  id: makeId(type.toLowerCase()),
  type,
  title,
  detail,
  timestamp: timestamp(),
})

const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

const addAchievement = (achievements: string[], achievement: string) =>
  achievements.includes(achievement) ? achievements : [...achievements, achievement]

const formatTrainingModule = (moduleId: TrainingModuleId) => moduleId.replace(/_/g, ' ')

const applyTrainingFeedback = (state: GameStore, feedback: TrainingFeedback): Partial<GameStore> => {
  const currentModule = state.training.modules[feedback.moduleId]
  const modules = {
    ...state.training.modules,
    [feedback.moduleId]: {
      ...currentModule,
      status: 'COMPLETE' as const,
      score: feedback.score,
      attempts: currentModule.attempts + 1,
    },
  }
  const scores = Object.values(modules)
    .map((module) => module.score)
    .filter((score): score is number => score !== null)

  return {
    training: {
      ...state.training,
      modules,
      lastFeedback: feedback,
      overallScore: scores.length === Object.keys(modules).length
        ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length)
        : state.training.overallScore,
      isEvaluating: false,
    },
    isAiThinking: false,
    aiStatus: feedback.outcome === 'SAFE_CHOICE' || feedback.outcome === 'STRONG_PREPAREDNESS' ? 'SUCCESS' : 'WARNING',
    aiMessage: feedback.rationale,
    lastAction: `TRAINING EVALUATED / ${formatTrainingModule(feedback.moduleId)}`,
    events: [
      ...state.events,
      makeEvent('TRAINING_EVALUATED', feedback.summary, feedback.rationale),
    ],
  }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      initializeSurvival: (profile) => {
        const initial = createInitialState()
        const resourceCount = {
          water: profile.water ? 2 : 0,
          food: profile.food ? 1 : 0,
          firstAid: profile.firstAid ? 1 : 0,
          flashlight: profile.flashlight ? 1 : 0,
          powerbank: profile.powerbank ? 1 : 0,
        }

        set({
          ...initial,
          hasStarted: true,
          player: {
            ...initial.player,
            name: profile.name.trim().toUpperCase(),
            companions: profile.companions,
            preparedness: profile.preparedness,
            ...resourceCount,
            health: profile.firstAid ? 94 : 86,
            battery: profile.powerbank ? 78 : 54,
          },
          aiStatus: 'MONITORING',
          aiMessage: 'Emergency response deployment begins now. Water level is rising near Zone 04.',
          lastAction: 'Responder profile initialized. Mission 01 ready.',
          events: [
            ...initial.events,
            makeEvent('BOOT', 'RESPONDER IDENTIFIED', `${profile.name.toUpperCase()} is now linked to RAKSHAK Emergency Response.`),
          ],
        })
        eventManager.resetForNewScenario()
      },

      acceptMission: () => {
        const state = get()
        if (state.currentMission.status !== 'AVAILABLE') return

        set({
          currentMission: { ...state.currentMission, status: 'ACTIVE' },
          aiStatus: 'RECOMMENDING',
          aiMessage: 'Mission accepted. Emergency Route B is plotted on higher ground.',
          lastAction: 'MISSION ACCEPTED / EMERGENCY ROUTE TRACKING ACTIVE',
          events: [
            ...state.events,
            makeEvent('MISSION_ACCEPTED', 'MISSION ACCEPTED', state.currentMission.objective),
          ],
        })
        eventManager.checkTriggers(get())
      },

      followRoute: (routeId = get().recommendedRoute) => {
        set({
          recommendedRoute: routeId,
          aiStatus: 'RECOMMENDING',
          aiMessage: `Route ${routeId} plotted. Keep moving toward the next verified beacon.`,
          lastAction: `ROUTE ${routeId} FOLLOW MODE ENGAGED`,
        })
      },

      chooseRoute: async (routeId) => {
        set({
          isAiThinking: true,
          aiStatus: 'ANALYZING',
          aiMessage: 'Analyzing distance, flood reports, road status and shelter capacity...',
          lastAction: `DECISION RECEIVED / ROUTE ${routeId}`,
        })
        const decision = await mockAiService.evaluateDecision(get(), routeId)

        set((state) => {
          const nextXp = state.player.xp + decision.xpEarned
          const nextLevel = nextXp >= 300 ? Math.max(state.player.level, 2) : state.player.level
          const nextAchievements = decision.outcome === 'GOOD_DECISION'
            ? addAchievement(state.achievements, 'SAFE DECISION MAKER')
            : state.achievements

          return {
            isAiThinking: false,
            lastDecision: decision,
            recommendedRoute: routeId,
            aiStatus: decision.outcome === 'GOOD_DECISION' ? 'SUCCESS' : 'WARNING',
            aiMessage: decision.reason,
            lastAction: decision.outcome === 'GOOD_DECISION' ? 'GOOD DECISION / SAFETY SCORE UPDATED' : 'RISK DETECTED / ROUTE LOGGED',
            player: {
              ...state.player,
              xp: nextXp,
              level: nextLevel,
              safetyScore: Math.round((state.player.safetyScore + decision.safetyScore) / 2),
              decisionScore: decision.decisionScore,
              navigationScore: decision.outcome === 'GOOD_DECISION'
                ? Math.min(100, state.player.navigationScore + 4)
                : Math.max(0, state.player.navigationScore - 4),
            },
            achievements: nextAchievements,
            events: [
              ...state.events,
              makeEvent(
                'DECISION_EVALUATED',
                decision.outcome === 'GOOD_DECISION' ? 'GOOD DECISION' : 'RISK DETECTED',
                decision.reason,
              ),
            ],
          }
        })
      },

      analyzeFloodImage: async (input, source) => {
        set({
          scannerStatus: 'SCANNING',
          scanResult: null,
          isAiThinking: true,
          aiStatus: 'ANALYZING',
          aiMessage: 'Analyzing image. This is AI-assisted classification, not autonomous emergency decision-making.',
          lastAction: 'FLOOD SCANNER / IMAGE ANALYSIS IN PROGRESS',
        })
        const result = await mockAiService.analyzeFloodImage(input)
        set({
          scannerStatus: 'READY',
          scanResult: result,
          isAiThinking: false,
          aiStatus: 'RECOMMENDING',
          aiMessage: 'Potential flood condition detected. Confirm this report before it affects the map.',
          lastAction: `${source === 'UPLOAD' ? 'UPLOAD' : 'DEMO IMAGE'} SCAN COMPLETE / HUMAN CONFIRMATION REQUIRED`,
        })
      },

      confirmScan: () => {
        const state = get()
        if (!state.scanResult) return
        const report = {
          ...state.scanResult,
          id: makeId('hazard'),
          confirmed: true,
          source: 'DEMO_IMAGE' as const,
          timestamp: timestamp(),
          location: 'LOWER EAST / ROAD A',
        }

        set({
          reports: [...state.reports, report],
          scannerStatus: 'IDLE',
          scanResult: null,
          aiStatus: 'SUCCESS',
          aiMessage: 'Verified hazard added to the tactical map. Route B remains the safer recommendation.',
          lastAction: 'HAZARD VERIFIED / MAP STATE UPDATED',
          player: {
            ...state.player,
            xp: state.player.xp + 75,
            communityScore: Math.min(100, state.player.communityScore + 8),
          },
          achievements: addAchievement(state.achievements, 'HAZARD REPORTER'),
          events: [
            ...state.events,
            makeEvent('REPORT_CONFIRMED', 'HAZARD REPORT VERIFIED', 'Flooded road classification pinned to Road A.'),
          ],
        })
      },

      discardScan: () => {
        set({
          scannerStatus: 'IDLE',
          scanResult: null,
          isAiThinking: false,
          aiStatus: 'MONITORING',
          aiMessage: 'Report discarded. No map state changed.',
          lastAction: 'SCAN DISCARDED / MAP UNCHANGED',
        })
      },

      completeCommunityAction: (actionId) => {
        const state = get()
        if (state.communityActionIds.includes(actionId)) return
        const nextSafe = Math.min(state.community.targetSafe, state.community.safe + 1)
        const nextCommunityActions = [...state.communityActionIds, actionId]
        const completedThree = nextCommunityActions.length >= 3

        set({
          communityActionIds: nextCommunityActions,
          community: {
            ...state.community,
            safe: nextSafe,
            unverified: actionId === 'verify-report' ? Math.max(0, state.community.unverified - 1) : state.community.unverified,
          },
          player: {
            ...state.player,
            xp: state.player.xp + 25,
            communityScore: Math.min(100, state.player.communityScore + 5),
          },
          achievements: completedThree ? addAchievement(state.achievements, 'COMMUNITY HELPER') : state.achievements,
          aiStatus: 'SUCCESS',
          aiMessage: 'Emergency action logged. The community evacuation objective is moving forward.',
          lastAction: `EMERGENCY ACTION COMPLETE / ${nextSafe} OF ${state.community.targetSafe} SAFE`,
          events: [
            ...state.events,
            makeEvent('COMMUNITY_ACTION', 'EMERGENCY ACTION VERIFIED', 'Progress rewards preparedness and verified information sharing.'),
          ],
        })
        eventManager.checkTriggers(get())
      },

      useInventoryItem: (item) => {
        const state = get()
        const player = { ...state.player }
        let message = 'Inventory action logged.'

        if (item === 'powerbank' && player.powerbank > 0) {
          player.powerbank -= 1
          player.battery = Math.min(100, player.battery + 25)
          message = 'Powerbank used. Simulated battery restored by 25 percent.'
        } else if (item === 'firstAid' && player.firstAid > 0) {
          player.firstAid -= 1
          player.health = Math.min(100, player.health + 20)
          message = 'First aid kit used as a game mechanic. Health restored by 20 points.'
        } else if (item === 'flashlight' && player.flashlight > 0) {
          player.battery = Math.max(0, player.battery - 2)
          message = 'Flashlight activated for simulated night navigation. Battery -2 percent.'
        } else if (item === 'water' && player.water > 0) {
          player.water -= 1
          message = 'Water ration consumed. Resource count updated.'
        } else if (item === 'food' && player.food > 0) {
          player.food -= 1
          message = 'Food ration consumed. Resource count updated.'
        } else {
          message = 'That resource is not available in the current loadout.'
        }

        set({
          player,
          aiMessage: message,
          lastAction: `INVENTORY / ${item.toUpperCase()} ACTION`,
        })
      },

      setDemoControl: async (control) => {
        const state = get()
        const nextRoads = state.roads.map((road) => {
          if (road.id === 'road-a' && control.roadA) return { ...road, status: control.roadA }
          if (road.id === 'road-b' && control.roadB) return { ...road, status: control.roadB }
          return road
        })
        const nextShelters = state.shelters.map((shelter) => {
          if (shelter.id === 'shelter-a' && control.shelterA) {
            return { ...shelter, status: control.shelterA, capacityPercent: control.shelterA === 'FULL' ? 95 : shelter.capacityPercent }
          }
          if (shelter.id === 'shelter-b' && control.shelterB) {
            return { ...shelter, status: control.shelterB, capacityPercent: control.shelterB === 'FULL' ? 96 : shelter.capacityPercent }
          }
          return shelter
        })
        const nextWeather = control.weather ?? state.weather
        const nextFlood = control.floodLevel ?? state.floodLevel

        set({
          weather: nextWeather,
          floodLevel: nextFlood,
          roads: nextRoads,
          shelters: nextShelters,
          community: {
            ...state.community,
            unverified: control.communityReports ?? state.community.unverified,
          },
          player: {
            ...state.player,
            battery: control.playerBattery ?? state.player.battery,
          },
          isAiThinking: true,
          aiStatus: 'ANALYZING',
          aiMessage: 'Simulation input changed. RAKSHAK is recalculating mission risk.',
          lastAction: 'JUDGE CONTROL CHANGED / RECALCULATING GAME STATE',
          floodTimeline: [
            ...state.floodTimeline.slice(-4),
            { time: timestamp(), level: nextFlood === 'CRITICAL' ? 96 : nextFlood === 'HIGH' ? 74 : 52, risk: nextFlood === 'CRITICAL' ? 98 : 72 },
          ],
        })
        const mission = await mockAiService.generateMission(get())
        set((current) => ({
          isAiThinking: false,
          aiStatus: mission.eventType === 'FLOOD_ESCALATION' ? 'MISSION_UPDATED' : 'RECOMMENDING',
          aiMessage: mission.reason,
          recommendedRoute: mission.recommendedRoute,
          currentMission: {
            ...current.currentMission,
            title: mission.missionTitle,
            description: mission.missionDescription,
            risk: mission.riskLevel,
            rewardXp: mission.xpReward,
            status: current.currentMission.status === 'COMPLETE' ? 'AVAILABLE' : current.currentMission.status,
          },
        }))
      },

      simulateFloodEscalation: async () => {
        set((state) => ({
          demoMode: true,
          escalationActive: true,
          isAiThinking: true,
          aiStatus: 'WARNING',
          aiMessage: 'Flood escalation detected. Locking the map and recalculating all routes.',
          lastAction: 'FLOOD ESCALATION / STAGE 01 OF 03',
          events: [...state.events, makeEvent('FLOOD_ESCALATION', 'FLOOD ESCALATION TRIGGERED', 'Rainfall is intensifying across Zone 04.')],
        }))
        await wait(700)
        set((state) => ({
          weather: 'EXTREME',
          floodLevel: 'CRITICAL',
          roads: state.roads.map((road) =>
            road.id === 'road-a' ? { ...road, status: 'BLOCKED', risk: 'CRITICAL' } : road,
          ),
          shelters: state.shelters.map((shelter) =>
            shelter.id === 'shelter-a'
              ? { ...shelter, capacityPercent: 95, status: 'FULL' }
              : shelter,
          ),
          aiStatus: 'ANALYZING',
          aiMessage: 'Road A is blocked. Shelter A is 95 percent full. Searching for a viable extraction.',
          lastAction: 'FLOOD ESCALATION / STAGE 02 OF 03',
          floodTimeline: [...state.floodTimeline, { time: timestamp(), level: 96, risk: 99 }],
        }))
        await wait(700)
        const mission = await mockAiService.generateMission(get())
        set((state) => ({
          isAiThinking: false,
          aiStatus: 'MISSION_UPDATED',
          aiMessage: 'Your previous route is no longer recommended. This situation has changed. New survival mission generated.',
          recommendedRoute: mission.recommendedRoute,
          currentMission: {
            id: 'mission-02',
            title: mission.missionTitle,
            description: mission.missionDescription,
            objective: 'Reach Shelter B before the lower district submerges.',
            risk: mission.riskLevel,
            distanceKm: 1.8,
            rewardXp: mission.xpReward,
            status: 'AVAILABLE',
          },
          lastAction: 'FLOOD ESCALATION / STAGE 03 OF 03 / MISSION UPDATED',
          events: [...state.events, makeEvent('FLOOD_ESCALATION', 'MISSION UPDATED', mission.reason)],
        }))
      },

      completeMission: () => {
        const state = get()
        if (state.currentMission.status === 'COMPLETE') return
        const nextXp = state.player.xp + state.currentMission.rewardXp
        const nextAchievements = addAchievement(state.achievements, 'FIRST SURVIVAL')
        const withGuardian = state.escalationActive ? addAchievement(nextAchievements, 'FLOOD GUARDIAN') : nextAchievements

        set({
          currentMission: { ...state.currentMission, status: 'COMPLETE' },
          aiStatus: 'SUCCESS',
          aiMessage: 'Emergency response mission complete. You prioritized verified information and moved citizens toward safer ground.',
          lastAction: 'MISSION COMPLETE / EMERGENCY RESPONSE SCORE CALCULATED',
          player: {
            ...state.player,
            xp: nextXp,
            level: nextXp >= 300 ? Math.max(2, state.player.level) : state.player.level,
            safetyScore: Math.min(100, state.player.safetyScore + 4),
          },
          achievements: withGuardian,
          events: [...state.events, makeEvent('MISSION_COMPLETE', 'EMERGENCY RESPONSE COMPLETE', 'Safety-first emergency objective completed.')],
        })
        eventManager.checkTriggers(get())
      },

      setTrainingModule: (moduleId) => {
        set((state) => ({
          training: {
            ...state.training,
            activeModuleId: moduleId,
            modules: {
              ...state.training.modules,
              [moduleId]: {
                ...state.training.modules[moduleId],
                status: state.training.modules[moduleId].status === 'COMPLETE' ? 'COMPLETE' : 'IN_PROGRESS',
              },
            },
          },
          aiStatus: 'MONITORING',
          aiMessage: `Training module ready. ${formatTrainingModule(moduleId)} is waiting for your decision.`,
          lastAction: `TRAINING MODULE SELECTED / ${formatTrainingModule(moduleId)}`,
        }))
      },

      selectTrainingRisk: (choiceId) => {
        set((state) => ({
          training: {
            ...state.training,
            selection: { ...state.training.selection, riskChoiceId: choiceId },
          },
          lastAction: 'TRAINING / RISK RESPONSE SELECTED',
        }))
      },

      selectTrainingRoute: (routeId) => {
        set((state) => ({
          training: {
            ...state.training,
            selection: { ...state.training.selection, routeChoiceId: routeId },
          },
          lastAction: `TRAINING / ROUTE ${routeId} SELECTED`,
        }))
      },

      toggleTrainingItem: (itemId) => {
        set((state) => {
          const selected = state.training.selection.preparednessItemIds
          const preparednessItemIds = selected.includes(itemId)
            ? selected.filter((selectedId) => selectedId !== itemId)
            : [...selected, itemId]

          return {
            training: {
              ...state.training,
              selection: { ...state.training.selection, preparednessItemIds },
            },
            lastAction: `TRAINING / ${itemId.replace(/_/g, ' ')} ${selected.includes(itemId) ? 'REMOVED' : 'SELECTED'}`,
          }
        })
      },

      evaluateTrainingRisk: async () => {
        const state = get()
        const choiceId = state.training.selection.riskChoiceId
        if (!choiceId || state.training.isEvaluating) return

        set((current) => ({
          training: { ...current.training, isEvaluating: true },
          isAiThinking: true,
          aiStatus: 'ANALYZING',
          aiMessage: 'RAKSHAK is comparing water level, ground elevation and verified shelter signals...',
          lastAction: 'TRAINING / FLOOD RISK EVALUATION IN PROGRESS',
        }))
        const feedback = await mockAiService.evaluateTrainingRisk(get(), choiceId)
        set((current) => applyTrainingFeedback(current, feedback))
      },

      evaluateTrainingRoute: async () => {
        const state = get()
        const routeId = state.training.selection.routeChoiceId
        if (!routeId || state.training.isEvaluating) return

        set((current) => ({
          training: { ...current.training, isEvaluating: true },
          isAiThinking: true,
          aiStatus: 'ANALYZING',
          aiMessage: 'RAKSHAK is comparing distance, road status, battery demand and shelter capacity...',
          lastAction: 'TRAINING / ROUTE EVALUATION IN PROGRESS',
        }))
        const feedback = await mockAiService.evaluateTrainingRoute(get(), routeId)
        set((current) => applyTrainingFeedback(current, feedback))
      },

      evaluateTrainingPreparedness: async () => {
        const state = get()
        const itemIds = state.training.selection.preparednessItemIds
        if (!itemIds.length || state.training.isEvaluating) return

        set((current) => ({
          training: { ...current.training, isEvaluating: true },
          isAiThinking: true,
          aiStatus: 'ANALYZING',
          aiMessage: 'RAKSHAK is checking essentials, communication support and unnecessary load...',
          lastAction: 'TRAINING / PREPAREDNESS EVALUATION IN PROGRESS',
        }))
        const feedback = await mockAiService.evaluateTrainingPreparedness(get(), itemIds)
        set((current) => applyTrainingFeedback(current, feedback))
      },

      practiceTrainingAgain: () => {
        set((state) => ({
          training: createInitialTrainingState(),
          isAiThinking: false,
          aiStatus: 'MONITORING',
          aiMessage: 'Training slate reset. Choose a module and practice a safer decision.',
          lastAction: 'TRAINING RESET / READY FOR PRACTICE',
          events: [...state.events, makeEvent('TRAINING_RESET', 'TRAINING RESET', 'Training progress cleared without changing the survival run.')],
        }))
      },

      setSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
          lastAction: 'ACCESSIBILITY SETTINGS UPDATED',
        }))
      },

      setDemoMode: (enabled) => {
        set({
          demoMode: enabled,
          lastAction: enabled ? 'SIMULATED DATA LABEL ACTIVE' : 'SIMULATION LABEL HIDDEN',
        })
      },

      resetGame: () => {
        eventManager.reset()
        set(createInitialState())
      },

      checkDisasterTriggers: () => {
        const state = get()
        eventManager.checkTriggers(state)
        const activeAlerts = eventManager.getActiveAlerts()
        if (activeAlerts.length > 0) {
          set({
            activeDisasterAlerts: activeAlerts.map((a) => a.scenario.id),
          })
        }
      },

      dismissDisasterAlert: (alertId) => {
        eventManager.dismissAlert(alertId)
        set((state) => ({
          activeDisasterAlerts: state.activeDisasterAlerts.filter((id) => id !== alertId),
        }))
      },
    }),
    {
      name: 'flood-survive-state',
      version: 1,
    },
  ),
)

export const getDecisionTone = (decision: AiDecisionOutput | null) => {
  if (!decision) return 'muted'
  return decision.outcome === 'GOOD_DECISION' ? 'safe' : 'danger'
}
