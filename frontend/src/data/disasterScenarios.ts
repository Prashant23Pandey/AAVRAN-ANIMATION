export type DisasterType = 'flood' | 'earthquake' | 'severeWeather'
export type ScenarioPhase = 'preEvent' | 'activeResponse' | 'postEvent' | 'immediateAction' | 'indoorSafety' | 'postShaking' | 'emergencyKit' | 'communication'
export type AlertSeverity = 'INFO' | 'ADVISORY' | 'WARNING' | 'CRITICAL'

export interface DisasterScenario {
  id: string
  type: DisasterType
  phase: ScenarioPhase
  severity: AlertSeverity
  title: string
  message: string
  triggerCondition: {
    type: 'coordinate' | 'taskComplete' | 'floodLevel' | 'roadBlocked' | 'shelterFull' | 'timeElapsed' | 'missionStatus'
    value: string | number
  }
  displayDuration: number
  priority: number
}

export interface ActiveAlert {
  scenario: DisasterScenario
  triggeredAt: number
  dismissed: boolean
}

export const disasterScenarios: DisasterScenario[] = [
  {
    id: 'flood-pre-flash-warning',
    type: 'flood',
    phase: 'preEvent',
    severity: 'WARNING',
    title: 'FLASH FLOOD WARNING',
    message: 'Flash flood warning issued. Move to higher ground immediately and avoid low-lying roads.',
    triggerCondition: { type: 'floodLevel', value: 'MEDIUM' },
    displayDuration: 8000,
    priority: 2,
  },
  {
    id: 'flood-active-response',
    type: 'flood',
    phase: 'activeResponse',
    severity: 'CRITICAL',
    title: 'ACTIVE FLOOD RESPONSE',
    message: 'Do not walk, swim, or drive through moving water. Just 6 inches of moving water can knock you down.',
    triggerCondition: { type: 'floodLevel', value: 'HIGH' },
    displayDuration: 10000,
    priority: 1,
  },
  {
    id: 'flood-post-safety',
    type: 'flood',
    phase: 'postEvent',
    severity: 'ADVISORY',
    title: 'POST-FLOOD SAFETY',
    message: 'Avoid floodwaters - they may be contaminated or electrically charged by downed power lines.',
    triggerCondition: { type: 'missionStatus', value: 'COMPLETE' },
    displayDuration: 8000,
    priority: 3,
  },
  {
    id: 'earthquake-immediate',
    type: 'earthquake',
    phase: 'immediateAction',
    severity: 'CRITICAL',
    title: 'EARTHQUAKE DETECTED',
    message: 'Earthquake detected! DROP to your hands and knees, COVER your head and neck under sturdy furniture, and HOLD ON until shaking stops.',
    triggerCondition: { type: 'roadBlocked', value: 'road-a' },
    displayDuration: 12000,
    priority: 0,
  },
  {
    id: 'earthquake-indoor',
    type: 'earthquake',
    phase: 'indoorSafety',
    severity: 'WARNING',
    title: 'INDOOR SAFETY',
    message: 'Stay away from glass, exterior walls, and heavy fixtures that could fall.',
    triggerCondition: { type: 'floodLevel', value: 'CRITICAL' },
    displayDuration: 8000,
    priority: 2,
  },
  {
    id: 'earthquake-post-shaking',
    type: 'earthquake',
    phase: 'postShaking',
    severity: 'ADVISORY',
    title: 'POST-SHAKING RESPONSE',
    message: 'Expect aftershocks. Check yourself and others for injuries, and exit damaged structures cautiously.',
    triggerCondition: { type: 'shelterFull', value: 'shelter-a' },
    displayDuration: 8000,
    priority: 3,
  },
  {
    id: 'weather-emergency-kit',
    type: 'severeWeather',
    phase: 'emergencyKit',
    severity: 'INFO',
    title: 'EMERGENCY KIT REMINDER',
    message: 'Always keep a 72-hour emergency kit ready with clean water, non-perishable food, flashlights, and first-aid supplies.',
    triggerCondition: { type: 'taskComplete', value: 'verify-report' },
    displayDuration: 6000,
    priority: 4,
  },
  {
    id: 'weather-communication',
    type: 'severeWeather',
    phase: 'communication',
    severity: 'INFO',
    title: 'EMERGENCY COMMUNICATION',
    message: 'Keep phone lines clear for emergency responders - use text messaging to update loved ones.',
    triggerCondition: { type: 'taskComplete', value: 'share-alert' },
    displayDuration: 6000,
    priority: 4,
  },
]

export const emergencyZones = [
  { id: 'zone-04-east', name: 'EMERGENCY ZONE 04 EAST', type: 'emergencyZone' as const, coordinates: { x: 0.6, y: 0.4 } },
  { id: 'relief-shelter-a', name: 'RELIEF SHELTER A', type: 'reliefShelter' as const, coordinates: { x: 0.3, y: 0.2 } },
  { id: 'relief-shelter-b', name: 'RELIEF SHELTER B', type: 'reliefShelter' as const, coordinates: { x: 0.8, y: 0.3 } },
  { id: 'citizen-node-01', name: 'CITIZEN INTERACTION NODE 01', type: 'citizenNode' as const, coordinates: { x: 0.5, y: 0.6 } },
  { id: 'citizen-node-02', name: 'CITIZEN INTERACTION NODE 02', type: 'citizenNode' as const, coordinates: { x: 0.4, y: 0.7 } },
]

export const emergencyItems = [
  { id: 'survival-kit', name: 'CRITICAL SURVIVAL KIT', description: 'Contains essential survival supplies for 72 hours.', category: 'survival' as const },
  { id: 'warning-broadcast', name: 'WARNING BROADCAST DEVICE', description: 'Transmits emergency alerts to nearby citizens.', category: 'broadcast' as const },
  { id: 'safety-manual', name: 'DISASTER SAFETY MANUAL', description: 'Quick-reference guide for flood, earthquake, and severe weather protocols.', category: 'information' as const },
  { id: 'first-aid-pack', name: 'FIRST AID PACK', description: 'Basic medical supplies for emergency response.', category: 'medical' as const },
  { id: 'flashlight-pro', name: 'PRO FLASHLIGHT', description: 'High-visibility flashlight for search and rescue operations.', category: 'equipment' as const },
]
