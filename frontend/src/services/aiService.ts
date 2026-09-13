import { trainingKitItems, trainingRiskChoices, trainingRouteById } from '../data/trainingData'
import type {
  AiService,
  GameState,
  RouteId,
  ScanResult,
  TrainingFeedback,
  TrainingItemId,
} from '../types/game'

const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

const floodWeight: Record<GameState['floodLevel'], number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 5,
}


const routeFallback: Record<RouteId, { score: number; reason: string }> = {
  A: {
    score: 48,
    reason: 'Route A crosses the low bridge. A shorter distance does not offset the rising-water exposure.',
  },
  B: {
    score: 92,
    reason: 'Route B stays on higher ground and keeps a verified shelter beacon in range.',
  },
  C: {
    score: 76,
    reason: 'Route C avoids the bridge, but the extra distance increases battery demand.',
  },
}

const classification: ScanResult = {
  classification: 'FLOODED_ROAD',
  confidence: 87,
  summary: 'Standing water spans the lower lane. A vehicle obstruction is visible beyond the caution marker.',
}

const makeTrainingFeedback = (
  moduleId: TrainingFeedback['moduleId'],
  outcome: TrainingFeedback['outcome'],
  score: number,
  summary: string,
  rationale: string,
  strengths: string[],
  improvements: string[],
  nextStep: string,
): TrainingFeedback => ({
  moduleId,
  outcome,
  score,
  summary,
  rationale,
  strengths,
  improvements,
  nextStep,
})

const mockAiService: AiService = {
  calculateRisk(state) {
    const blockedRoads = state.roads.filter((road) => road.status === 'BLOCKED').length
    const fullShelters = state.shelters.filter((shelter) => shelter.status === 'FULL').length
    const score = floodWeight[state.floodLevel] + blockedRoads * 2 + fullShelters + (state.player.battery < 20 ? 1 : 0)

    if (score >= 7) return 'CRITICAL'
    if (score >= 5) return 'HIGH'
    if (score >= 3) return 'MEDIUM'
    return 'LOW'
  },

  async generateMission(state) {
    await wait(420)
    const riskLevel = this.calculateRisk(state)
    const roadA = state.roads.find((road) => road.id === 'road-a')
    const shelterA = state.shelters.find((shelter) => shelter.id === 'shelter-a')
    const critical = state.floodLevel === 'CRITICAL' || roadA?.status === 'BLOCKED' || shelterA?.status === 'FULL'

    if (critical) {
      return {
        riskLevel,
        missionTitle: 'REACH EMERGENCY SHELTER B',
        missionDescription: 'Relief Shelter A is no longer a reliable extraction point. Deploy to the higher-capacity eastern emergency beacon.',
        recommendedRoute: 'B',
        difficulty: 4,
        reason: 'Road A is blocked and Relief Shelter A is near capacity. Route B currently carries the lower reported risk for emergency evacuation.',
        xpReward: 240,
        eventType: 'FLOOD_ESCALATION',
      }
    }

    if (riskLevel === 'HIGH') {
      return {
        riskLevel,
        missionTitle: 'REACH EMERGENCY ZONE 04',
        missionDescription: 'Floodwaters are rising. Cross the marked emergency corridor and check in before the next scan.',
        recommendedRoute: 'B',
        difficulty: 3,
        reason: 'Flood risk is high. The safer route adds distance but avoids the low bridge for emergency deployment.',
        xpReward: 180,
        eventType: 'MISSION_ACCEPTED',
      }
    }

    return {
      riskLevel,
      missionTitle: 'REACH SAFE ZONE',
      missionDescription: 'Follow the active beacon to the nearest verified emergency shelter.',
      recommendedRoute: 'B',
      difficulty: 2,
      reason: 'Route B balances distance, shelter capacity and current battery for emergency response.',
      xpReward: 150,
      eventType: 'MISSION_ACCEPTED',
    }
  },

  async evaluateDecision(state, decision) {
    await wait(1050)
    const selectedRoute = state.routes.find((route) => route.id === decision)
    const fallback = routeFallback[decision]
    const isDangerous = selectedRoute?.risk === 'HIGH' || (state.escalationActive && decision === 'A')
    const safetyScore = isDangerous ? Math.min(fallback.score, 48) : fallback.score
    const decisionScore = isDangerous ? 44 : Math.min(98, safetyScore + 2)

    return {
      outcome: isDangerous ? 'RISK_DETECTED' : 'GOOD_DECISION',
      safetyScore,
      decisionScore,
      reason: isDangerous
        ? 'The short line enters a low-bridge flood pocket. The simulation flags this as avoidable exposure during emergency response.'
        : fallback.reason,
      xpEarned: isDangerous ? 35 : 100,
    }
  },

  async analyzeFloodImage(input) {
    void input
    await wait(1250)
    return classification
  },

  async evaluateTrainingRisk(state, choiceId) {
    await wait(620)
    const choice = trainingRiskChoices.find((option) => option.id === choiceId)
    const criticalContext = state.floodLevel === 'CRITICAL' || state.escalationActive

    if (choiceId === 'HIGH_GROUND') {
      return makeTrainingFeedback(
        'RISK_AWARENESS',
        'SAFE_CHOICE',
        criticalContext ? 96 : 94,
        'SAFE CHOICE / MOVE BEFORE THE WATERLINE CATCHES YOU',
        `You recognized the rising-water signal and chose a verified high-ground beacon${criticalContext ? ' while conditions are already critical' : ''}.`,
        ['Prioritized higher ground over convenience.', 'Used a verified signal before committing the group.'],
        ['Keep the group together and check in once clear of low ground.'],
        'Continue to Route Decision and compare exposure against travel time.',
      )
    }

    if (choiceId === 'UNVERIFIED_SHORTCUT') {
      return makeTrainingFeedback(
        'RISK_AWARENESS',
        'RISK_DETECTED',
        48,
        'RISK DETECTED / UNVERIFIED INFORMATION',
        `The shortcut could be useful, but it crosses a decision point that has not been verified. ${choice?.label ?? 'This choice'} increases uncertainty while the water is rising.`,
        ['You were looking for a faster evacuation option.'],
        ['Confirm the road or beacon before moving the group.', 'Treat an unverified shortcut as a risk signal, not a safe route.'],
        'Practice the same scenario again and choose the verified high-ground response.',
      )
    }

    if (choiceId === 'WAIT_UNDERPASS') {
      return makeTrainingFeedback(
        'RISK_AWARENESS',
        'RISK_DETECTED',
        28,
        'RISK DETECTED / LOW GROUND IS NOT A WAITING ROOM',
        'Waiting in a low underpass leaves the group exposed to rising water and removes time from the evacuation window.',
        ['You avoided driving into unknown water.'],
        ['Move away from low ground earlier.', 'Use verified shelter information instead of waiting for conditions to improve.'],
        'Re-read the waterline signal, then practice selecting higher ground.',
      )
    }

    return makeTrainingFeedback(
      'RISK_AWARENESS',
      'RISK_DETECTED',
      12,
      'RISK DETECTED / STANDING WATER HIDES THE ROAD',
      'Driving through standing water trades a short distance for a severe loss of visibility, traction and escape options.',
      ['You were trying to preserve time.'],
      ['Do not enter unknown standing water.', 'Use the verified high-ground beacon even when it adds distance.'],
      'Practice the scenario again and choose the action that creates more time and visibility.',
    )
  },

  async evaluateTrainingRoute(state, routeId) {
    await wait(720)
    const route = trainingRouteById(routeId)
    const road = state.roads.find((candidate) => candidate.id === `road-${routeId.toLowerCase()}`)
    const batteryLimited = state.player.battery < 20
    const routeBlocked = road?.status === 'BLOCKED'

    if (routeId === 'B' && !routeBlocked) {
      return makeTrainingFeedback(
        'ROUTE_DECISION',
        'SAFE_CHOICE',
        96,
        'SAFE ROUTE / HIGH GROUND HOLDS',
        `Route B adds ${route?.distanceKm ?? 1.8} km, but it keeps the verified beacon in range and avoids the low bridge${state.floodLevel === 'CRITICAL' ? ' during critical flooding' : ''}.`,
        ['Compared exposure instead of choosing the shortest distance.', 'Kept a verified extraction point in range.'],
        ['Keep monitoring battery and shelter capacity while moving.'],
        'Continue to Emergency Preparedness and build a kit for the longer route.',
      )
    }

    if (routeId === 'B' && routeBlocked) {
      return makeTrainingFeedback(
        'ROUTE_DECISION',
        'RISK_DETECTED',
        36,
        'RISK DETECTED / VERIFIED ROUTE CURRENTLY BLOCKED',
        'Route B is normally the safer high-ground line, but its current road status has changed. Re-check the live map before moving.',
        ['You chose the route with the strongest baseline safety profile.'],
        ['Re-check changing road status before committing.', 'Use the next verified open beacon rather than assuming the old recommendation still holds.'],
        'Practice again after reviewing the current conditions panel.',
      )
    }

    if (routeId === 'C') {
      return makeTrainingFeedback(
        'ROUTE_DECISION',
        'NEEDS_REVIEW',
        batteryLimited ? 62 : 78,
        'REVIEW / SAFE FALLBACK WITH A RESOURCE COST',
        `Route C avoids the bridge, but the ${route?.distanceKm ?? 2.2} km loop adds battery demand${batteryLimited ? ' while your current battery is already limited' : ''}.`,
        ['Avoided the low-bridge exposure.', 'Selected a route with a known condition.'],
        ['Check battery before committing to the longer loop.', 'Prefer the verified high-ground beacon when it remains open.'],
        'Try Route B next and compare the score against the shorter route.',
      )
    }

    return makeTrainingFeedback(
      'ROUTE_DECISION',
      'RISK_DETECTED',
      routeBlocked ? 24 : 44,
      'RISK DETECTED / SHORT DOES NOT MEAN SAFE',
      `Route A is the shortest option, but it crosses the low bridge${routeBlocked ? ' and is currently blocked' : ''}. The changing water condition can erase its time advantage.`,
      ['You noticed the route would reduce travel time.'],
      ['Weight road exposure and verified shelter capacity above distance.', 'Do not commit to a blocked or low-bridge crossing.'],
      'Select the longer high-ground route and ask what condition it protects you from.',
    )
  },

  async evaluateTrainingPreparedness(state, itemIds) {
    await wait(680)
    const selected = new Set<TrainingItemId>(itemIds)
    const essentials = trainingKitItems.filter((item) => item.essential)
    const essentialCount = essentials.filter((item) => selected.has(item.id)).length
    const supportCount = Number(selected.has('RADIO')) + Number(selected.has('EMERGENCY_BLANKET'))
    const distractorCount = Number(selected.has('NONESSENTIAL_LOAD'))
    const score = Math.min(100, Math.max(20, 20 + essentialCount * 17 + supportCount * 6 - distractorCount * 12))
    const missingEssentials = essentials.filter((item) => !selected.has(item.id)).map((item) => item.label)
    const selectedUseful = trainingKitItems.filter((item) => selected.has(item.id) && item.id !== 'NONESSENTIAL_LOAD').map((item) => item.label)
    const improvements = [
      ...(missingEssentials.length ? [`Add: ${missingEssentials.join(', ')}.`] : []),
      ...(distractorCount ? ['Remove the heavy nonessential load so the group can move efficiently.'] : []),
      ...(state.player.battery < 20 && !selected.has('POWERBANK') ? ['Battery is low; include a powerbank before leaving.'] : []),
    ]

    return makeTrainingFeedback(
      'EMERGENCY_PREPAREDNESS',
      essentialCount === essentials.length && distractorCount === 0 ? 'STRONG_PREPAREDNESS' : 'NEEDS_REVIEW',
      score,
      essentialCount === essentials.length && distractorCount === 0
        ? 'STRONG KIT / ESSENTIALS COVER THE MOVEMENT WINDOW'
        : 'REVIEW KIT / CLOSE THE MOST IMPORTANT GAPS FIRST',
      `You selected ${itemIds.length} item${itemIds.length === 1 ? '' : 's'}. The kit is evaluated for movement, communication and basic simulated support—not for medical or emergency instructions.`,
      selectedUseful.length ? [`Useful selections: ${selectedUseful.join(', ')}.`] : ['You started the kit check and can still add useful essentials.'],
      improvements.length ? improvements : ['Keep the kit compact and re-check the loadout before movement.'],
      'Practice the kit check again, then return to Flood Risk Awareness for a full cycle.',
    )
  },

  async generateAssistantResponse(state) {
    await wait(320)
    if (state.escalationActive || state.floodLevel === 'CRITICAL') {
      return {
        status: 'MISSION_UPDATED',
        message: 'Your previous route is no longer recommended. This situation has changed. Follow the new Emergency Shelter B mission.',
        action: 'OPEN_MISSION',
      }
    }

    if (state.lastDecision?.outcome === 'GOOD_DECISION') {
      return {
        status: 'SUCCESS',
        message: 'Good decision. Keep the verified emergency beacon in sight and conserve battery for the final approach.',
        action: 'SHOW_ROUTE',
      }
    }

    return {
      status: 'RECOMMENDING',
      message: 'Route B currently carries the lower reported risk. I am plotting high ground around the low bridge for emergency deployment.',
      action: 'SHOW_ROUTE',
    }
  },
}

export { mockAiService }
