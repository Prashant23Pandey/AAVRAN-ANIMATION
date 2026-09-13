import type {
  RouteId,
  TrainingKitItem,
  TrainingModuleId,
  TrainingRiskChoice,
  TrainingRouteOption,
} from '../types/game'

export const trainingModuleOrder: TrainingModuleId[] = [
  'RISK_AWARENESS',
  'ROUTE_DECISION',
  'EMERGENCY_PREPAREDNESS',
]

export const trainingModuleMeta: Record<TrainingModuleId, { label: string; shortLabel: string; description: string }> = {
  RISK_AWARENESS: {
    label: 'DISASTER RISK AWARENESS',
    shortLabel: 'RISK AWARENESS',
    description: 'Recognize flood, earthquake, and severe weather signals before choosing an action.',
  },
  ROUTE_DECISION: {
    label: 'EMERGENCY ROUTE DECISION',
    shortLabel: 'ROUTE DECISION',
    description: 'Compare time, exposure and changing conditions during disaster response.',
  },
  EMERGENCY_PREPAREDNESS: {
    label: 'EMERGENCY PREPAREDNESS',
    shortLabel: 'PREPAREDNESS',
    description: 'Build a 72-hour survival kit without carrying avoidable weight.',
  },
}

export const trainingRiskChoices: TrainingRiskChoice[] = [
  {
    id: 'HIGH_GROUND',
    label: 'Move to verified high ground',
    summary: 'Follow the marked emergency beacon and evacuate the low underpass before floodwaters rise further.',
  },
  {
    id: 'WAIT_UNDERPASS',
    label: 'Wait in the low underpass',
    summary: 'Stay put until the rain eases, even though the waterline is already moving upward in the flood zone.',
  },
  {
    id: 'DRIVE_STANDING_WATER',
    label: 'Drive through standing water',
    summary: 'Use the shortest road across the flooded lane because the emergency destination is nearby.',
  },
  {
    id: 'UNVERIFIED_SHORTCUT',
    label: 'Follow an unverified shortcut',
    summary: 'Take a community tip toward the bridge without confirming the road condition during the disaster first.',
  },
]

export const trainingRouteOptions: TrainingRouteOption[] = [
  {
    id: 'A',
    label: 'SHORT ROUTE / LOW BRIDGE',
    distanceKm: 1.1,
    estimatedMinutes: 18,
    risk: 'HIGH',
    condition: 'Road A has low-bridge exposure and can close as floodwaters rise.',
    summary: 'Fastest on paper, but a blocked crossing turns the time advantage into a trap.',
  },
  {
    id: 'B',
    label: 'HIGH GROUND / VERIFIED BEACON',
    distanceKm: 1.8,
    estimatedMinutes: 28,
    risk: 'LOW',
    condition: 'Road B remains open and keeps a verified emergency shelter beacon in range.',
    summary: 'Adds distance while reducing water exposure and preserving a reliable extraction point.',
  },
  {
    id: 'C',
    label: 'NORTH LOOP / BATTERY DEMAND',
    distanceKm: 2.2,
    estimatedMinutes: 34,
    risk: 'MEDIUM',
    condition: 'The bridge is avoided, but the longer loop consumes more time and battery during emergency response.',
    summary: 'A workable fallback when the bridge is uncertain, with a larger resource cost.',
  },
]

export const trainingKitItems: TrainingKitItem[] = [
  { id: 'WATER', label: 'Clean water ration', description: 'Supports hydration during a delayed evacuation. Essential for 72-hour survival.', essential: true },
  { id: 'FIRST_AID', label: 'First aid kit', description: 'Basic medical supplies for emergency injury response.', essential: true },
  { id: 'FLASHLIGHT', label: 'Emergency flashlight', description: 'Critical for visibility during power outages and nighttime operations.', essential: true },
  { id: 'POWERBANK', label: 'Portable powerbank', description: 'Preserves phone battery for maps, emergency alerts and check-ins.', essential: true },
  { id: 'RADIO', label: 'Battery-powered radio', description: 'Provides emergency broadcast reception when cell networks are down.', essential: false },
  { id: 'EMERGENCY_BLANKET', label: 'Emergency thermal blanket', description: 'Compact warmth and protection from exposure during shelter delays.', essential: false },
  { id: 'NONESSENTIAL_LOAD', label: 'Heavy nonessential load', description: 'Adds weight without helping movement, communication or survival.', essential: false },
]

export const trainingRouteById = (routeId: RouteId) => trainingRouteOptions.find((route) => route.id === routeId)
