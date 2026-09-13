export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type WeatherLevel = 'LOW' | 'MODERATE' | 'HEAVY' | 'EXTREME'
export type FloodLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type RoadStatus = 'OPEN' | 'CAUTION' | 'BLOCKED'
export type ShelterStatus = 'AVAILABLE' | 'BUSY' | 'FULL'
export type AiStatus =
  | 'MONITORING'
  | 'ANALYZING'
  | 'WARNING'
  | 'RECOMMENDING'
  | 'MISSION_UPDATED'
  | 'SUCCESS'
export type MissionStatus = 'AVAILABLE' | 'ACTIVE' | 'COMPLETE'
export type RouteId = 'A' | 'B' | 'C'
export type TrainingModuleId = 'RISK_AWARENESS' | 'ROUTE_DECISION' | 'EMERGENCY_PREPAREDNESS'
export type TrainingModuleStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETE'
export type TrainingOutcome = 'SAFE_CHOICE' | 'RISK_DETECTED' | 'STRONG_PREPAREDNESS' | 'NEEDS_REVIEW'
export type TrainingItemId = 'WATER' | 'FIRST_AID' | 'FLASHLIGHT' | 'POWERBANK' | 'RADIO' | 'EMERGENCY_BLANKET' | 'NONESSENTIAL_LOAD'
export type MotionPreference = 'FULL' | 'REDUCED'
export type ScannerStatus = 'IDLE' | 'SCANNING' | 'READY'
export type Classification =
  | 'FLOODED_ROAD'
  | 'STANDING_WATER'
  | 'OBSTRUCTION'
  | 'VEHICLE_BLOCKAGE'
  | 'UNKNOWN'
export type EventType =
  | 'BOOT'
  | 'MISSION_ACCEPTED'
  | 'DECISION_EVALUATED'
  | 'REPORT_CONFIRMED'
  | 'FLOOD_ESCALATION'
  | 'MISSION_COMPLETE'
  | 'COMMUNITY_ACTION'
  | 'TRAINING_STARTED'
  | 'TRAINING_EVALUATED'
  | 'TRAINING_RESET'
  | 'DISASTER_ALERT'
  | 'EMERGENCY_ZONE_ENTERED'

export type NodeType = 'emergencyZone' | 'reliefShelter' | 'citizenNode'
export type ItemCategory = 'survival' | 'broadcast' | 'information' | 'medical' | 'equipment'

export interface EmergencyNode {
  id: string
  name: string
  type: NodeType
  coordinates: { x: number; y: number }
}

export interface EmergencyItem {
  id: string
  name: string
  description: string
  category: ItemCategory
}

export interface PlayerState {
  name: string
  companions: number
  preparedness: 'BASIC' | 'PREPARED' | 'ADVANCED'
  health: number
  battery: number
  water: number
  food: number
  firstAid: number
  flashlight: number
  powerbank: number
  xp: number
  level: number
  location: string
  safetyScore: number
  decisionScore: number
  navigationScore: number
  communityScore: number
}

export interface Road {
  id: string
  name: string
  status: RoadStatus
  risk: RiskLevel
}

export interface Shelter {
  id: string
  name: string
  capacityPercent: number
  status: ShelterStatus
  distanceKm: number
}

export interface RouteOption {
  id: RouteId
  label: string
  distanceKm: number
  risk: RiskLevel
  roadIds: string[]
  estimatedMinutes: number
  summary: string
}

export interface Mission {
  id: string
  title: string
  description: string
  objective: string
  risk: RiskLevel
  distanceKm: number
  rewardXp: number
  status: MissionStatus
}

export interface CommunityState {
  total: number
  safe: number
  evacuating: number
  unverified: number
  needsInformation: number
  targetSafe: number
}

export interface HazardReport {
  id: string
  classification: Classification
  confidence: number
  summary: string
  confirmed: boolean
  source: 'DEMO_IMAGE' | 'UPLOAD'
  timestamp: string
  location: string
}

export interface ScanResult {
  classification: Classification
  confidence: number
  summary: string
}

export interface FloodPoint {
  time: string
  level: number
  risk: number
}

export interface GameEvent {
  id: string
  type: EventType
  title: string
  detail: string
  timestamp: string
}

export interface AiMissionOutput {
  riskLevel: RiskLevel
  missionTitle: string
  missionDescription: string
  recommendedRoute: RouteId
  difficulty: number
  reason: string
  xpReward: number
  eventType: EventType
}

export interface AiDecisionOutput {
  outcome: 'GOOD_DECISION' | 'RISK_DETECTED'
  safetyScore: number
  decisionScore: number
  reason: string
  xpEarned: number
}

export interface AiAssistantOutput {
  status: AiStatus
  message: string
  action: 'SHOW_ROUTE' | 'OPEN_MISSION' | 'NONE'
}

export interface GameSettings {
  motion: MotionPreference
  sound: boolean
  colorAssistance: boolean
}

export interface SurvivorProfile {
  name: string
  companions: number
  preparedness: 'BASIC' | 'PREPARED' | 'ADVANCED'
  water: boolean
  food: boolean
  firstAid: boolean
  flashlight: boolean
  powerbank: boolean
}

export interface TrainingModuleState {
  id: TrainingModuleId
  status: TrainingModuleStatus
  score: number | null
  attempts: number
}

export interface TrainingSelection {
  riskChoiceId: string | null
  routeChoiceId: RouteId | null
  preparednessItemIds: TrainingItemId[]
}

export interface TrainingFeedback {
  moduleId: TrainingModuleId
  outcome: TrainingOutcome
  score: number
  summary: string
  rationale: string
  strengths: string[]
  improvements: string[]
  nextStep: string
}

export interface TrainingState {
  activeModuleId: TrainingModuleId
  modules: Record<TrainingModuleId, TrainingModuleState>
  selection: TrainingSelection
  lastFeedback: TrainingFeedback | null
  overallScore: number | null
  isEvaluating: boolean
}

export interface TrainingRiskChoice {
  id: string
  label: string
  summary: string
}

export interface TrainingRouteOption {
  id: RouteId
  label: string
  distanceKm: number
  estimatedMinutes: number
  risk: RiskLevel
  condition: string
  summary: string
}

export interface TrainingKitItem {
  id: TrainingItemId
  label: string
  description: string
  essential: boolean
}

export interface DemoControl {
  weather?: WeatherLevel
  floodLevel?: FloodLevel
  roadA?: RoadStatus
  roadB?: RoadStatus
  shelterA?: ShelterStatus
  shelterB?: ShelterStatus
  communityReports?: number
  playerBattery?: number
}

export interface GameState {
  hasStarted: boolean
  player: PlayerState
  weather: WeatherLevel
  floodLevel: FloodLevel
  roads: Road[]
  shelters: Shelter[]
  routes: RouteOption[]
  community: CommunityState
  currentMission: Mission
  reports: HazardReport[]
  achievements: string[]
  events: GameEvent[]
  aiStatus: AiStatus
  aiMessage: string
  recommendedRoute: RouteId
  demoMode: boolean
  escalationActive: boolean
  settings: GameSettings
  lastDecision: AiDecisionOutput | null
  scanResult: ScanResult | null
  scannerStatus: ScannerStatus
  isAiThinking: boolean
  lastAction: string
  communityActionIds: string[]
  floodTimeline: FloodPoint[]
  training: TrainingState
  emergencyNodes: EmergencyNode[]
  emergencyInventory: EmergencyItem[]
  activeDisasterAlerts: string[]
  role: 'SURVIVOR' | 'EMERGENCY_RESPONDER'
}

export interface AiService {
  generateMission(state: GameState): Promise<AiMissionOutput>
  evaluateDecision(state: GameState, decision: RouteId): Promise<AiDecisionOutput>
  analyzeFloodImage(input: string | File): Promise<ScanResult>
  generateAssistantResponse(state: GameState, userMessage?: string): Promise<AiAssistantOutput>
  evaluateTrainingRisk(state: GameState, choiceId: string): Promise<TrainingFeedback>
  evaluateTrainingRoute(state: GameState, routeId: RouteId): Promise<TrainingFeedback>
  evaluateTrainingPreparedness(state: GameState, itemIds: TrainingItemId[]): Promise<TrainingFeedback>
  calculateRisk(state: GameState): RiskLevel
}
