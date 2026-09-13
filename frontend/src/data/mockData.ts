import type { GameState, GameEvent, Mission, RouteOption, TrainingState, EmergencyNode, EmergencyItem } from '../types/game'
import { trainingModuleOrder } from './trainingData'
import { emergencyZones, emergencyItems } from './disasterScenarios'

const baseMission: Mission = {
  id: 'mission-01',
  title: 'REACH EMERGENCY ZONE 04 EAST',
  description: 'Deploy to Emergency Zone 04 East and coordinate citizen evacuation before water levels cross the caution threshold.',
  objective: 'Reach Emergency Zone 04 East and check in at the relief beacon.',
  risk: 'MEDIUM',
  distanceKm: 1.4,
  rewardXp: 150,
  status: 'AVAILABLE',
}

const baseRoutes: RouteOption[] = [
  {
    id: 'A',
    label: 'SHORT ROUTE',
    distanceKm: 1.1,
    risk: 'HIGH',
    roadIds: ['road-a'],
    estimatedMinutes: 18,
    summary: 'Fastest line through the low bridge. Flood reports are unverified.',
  },
  {
    id: 'B',
    label: 'SAFE ROUTE',
    distanceKm: 1.8,
    risk: 'LOW',
    roadIds: ['road-b'],
    estimatedMinutes: 28,
    summary: 'Longer route with higher ground and a verified beacon relay.',
  },
  {
    id: 'C',
    label: 'NORTH LOOP',
    distanceKm: 2.2,
    risk: 'MEDIUM',
    roadIds: ['road-c'],
    estimatedMinutes: 34,
    summary: 'Avoids the bridge, but adds distance and battery demand.',
  },
]

const seedEvent = (event: Omit<GameEvent, 'id'>): GameEvent => ({
  ...event,
  id: `event-${event.type.toLowerCase()}-seed`,
})

export const createInitialTrainingState = (): TrainingState => ({
  activeModuleId: trainingModuleOrder[0],
  modules: {
    RISK_AWARENESS: { id: 'RISK_AWARENESS', status: 'AVAILABLE', score: null, attempts: 0 },
    ROUTE_DECISION: { id: 'ROUTE_DECISION', status: 'AVAILABLE', score: null, attempts: 0 },
    EMERGENCY_PREPAREDNESS: { id: 'EMERGENCY_PREPAREDNESS', status: 'AVAILABLE', score: null, attempts: 0 },
  },
  selection: {
    riskChoiceId: null,
    routeChoiceId: null,
    preparednessItemIds: [],
  },
  lastFeedback: null,
  overallScore: null,
  isEvaluating: false,
})

export const createInitialState = (): GameState => ({
  hasStarted: false,
  player: {
    name: 'UNIDENTIFIED RESPONDER',
    companions: 1,
    preparedness: 'BASIC',
    health: 86,
    battery: 68,
    water: 2,
    food: 1,
    firstAid: 1,
    flashlight: 1,
    powerbank: 1,
    xp: 120,
    level: 1,
    location: 'ZONE 04 / LOWER EAST',
    safetyScore: 88,
    decisionScore: 84,
    navigationScore: 90,
    communityScore: 76,
  },
  weather: 'HEAVY',
  floodLevel: 'HIGH',
  roads: [
    { id: 'road-a', name: 'ROAD A / LOW BRIDGE', status: 'OPEN', risk: 'HIGH' },
    { id: 'road-b', name: 'ROAD B / HIGH GROUND', status: 'OPEN', risk: 'LOW' },
    { id: 'road-c', name: 'ROAD C / NORTH LOOP', status: 'CAUTION', risk: 'MEDIUM' },
  ],
  shelters: [
    { id: 'shelter-a', name: 'RELIEF SHELTER A', capacityPercent: 58, status: 'AVAILABLE', distanceKm: 1.4 },
    { id: 'shelter-b', name: 'RELIEF SHELTER B', capacityPercent: 45, status: 'AVAILABLE', distanceKm: 1.8 },
  ],
  routes: baseRoutes,
  community: {
    total: 47,
    safe: 24,
    evacuating: 14,
    unverified: 6,
    needsInformation: 3,
    targetSafe: 30,
  },
  currentMission: baseMission,
  reports: [],
  achievements: [],
  events: [
    seedEvent({
      type: 'BOOT',
      title: 'DEMO AI MODE',
      detail: 'Deterministic local emergency response engine online. External APIs are optional.',
      timestamp: '19:12',
    }),
  ],
  aiStatus: 'MONITORING',
  aiMessage: 'Water level is rising near your current zone. I am tracking verified signals.',
  recommendedRoute: 'B',
  demoMode: true,
  escalationActive: false,
  settings: {
    motion: 'FULL',
    sound: false,
    colorAssistance: false,
  },
  lastDecision: null,
  scanResult: null,
  scannerStatus: 'IDLE',
  isAiThinking: false,
  lastAction: 'System ready. Identify your responder profile to begin.',
  communityActionIds: [],
  floodTimeline: [
    { time: '18:30', level: 32, risk: 28 },
    { time: '18:45', level: 41, risk: 36 },
    { time: '19:00', level: 54, risk: 52 },
    { time: '19:15', level: 66, risk: 68 },
    { time: '19:30', level: 72, risk: 74 },
  ],
  training: createInitialTrainingState(),
  emergencyNodes: emergencyZones as EmergencyNode[],
  emergencyInventory: emergencyItems as EmergencyItem[],
  activeDisasterAlerts: [],
  role: 'EMERGENCY_RESPONDER',
})
