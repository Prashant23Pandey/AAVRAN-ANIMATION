# FLOOD//SURVIVE Demo Runbook

This runbook documents the current, working implementation of **FLOOD//SURVIVE**. It is intentionally based on the existing UI, routes, state transitions, mock data and mock AI service. It does not describe a redesign or future architecture.

## Demo preflight

- Start the app from `frontend/` with `npm run dev`.
- Open `http://localhost:5173/`.
- Use a desktop viewport for the full top navigation and bottom `DEMO CONTROL` dock. The mobile bottom navigation exposes the main HUD, map, missions, community and profile surfaces.
- State is persisted in browser local storage under `flood-survive-state`. For a clean repeat, use `RESET` in Judge Demo mode or `RESET DEMO STATE` in Settings, then return to `/` and begin again.
- The app is local-first. No API key, camera device, network service or external AI provider is required.

---

## 1. Landing page

**Route:** `/`

### What the user clicks

1. Click **ENTER SURVIVAL**.
2. Wait for the short `HANDSHAKE / SURVIVAL PROTOCOL INITIALIZING` transition.

### What should appear

- The FLOOD//SURVIVE title and Storm Protocol landing surface.
- `SYSTEM STATUS / ONLINE / SIMULATION READY`.
- The `FLOOD//KERNEL` boot panel with:
  - `REAL WORLD CONDITION LINK: READY`
  - `AI SURVIVAL ENGINE: STANDBY`
  - `SECTOR 04 FLOOD MODEL: LOADED`
  - `RAKSHAK AI: AWAITING SURVIVOR`
- Weather model status: `HEAVY RAIN`.
- A boot overlay while the app navigates to `/setup`.

### AI behavior demonstrated

- The landing page establishes that the local survival engine, flood model and RAKSHAK interface are available. No AI request is made yet.

### What the judge should notice

- The experience is framed as a real-world condition plus a game state, not as a generic form.
- The initial state is explicitly labeled as simulation-ready and does not imply live emergency operations.

### Expected result

- The app navigates to `/setup` after the initialization transition.

---

## 2. Survival setup

**Route:** `/setup`

### What the user clicks

1. Enter a survivor call sign in **Survivor call sign**. Use at least two characters; `NIGHTWATCH` is a good demo value.
2. Optionally change **Number of people with you**.
3. Optionally change **Basic preparedness** to `Prepared / balanced` or `Advanced / disciplined`.
4. Leave the five optional resources enabled for the fullest demo loadout:
   - Water
   - Food
   - First Aid
   - Flashlight
   - Powerbank
5. Click **START SURVIVAL**.

### What should appear

- The intake form shows `SURVIVOR INTAKE / STEP 01` and `PROFILE CONFIGURATION`.
- The form includes a local-demo privacy notice.
- If the name is shorter than two characters, the form stays on this screen and shows `Enter at least two characters for your survivor call sign.`.
- With all resources enabled, the initialized player receives the corresponding resource counts, health of `94%` and battery of `78%`.
- The app navigates to `/briefing`.

### AI behavior demonstrated

- `initializeSurvival` creates a fresh game state and links the named survivor to RAKSHAK.
- The store records a `SURVIVOR IDENTIFIED` event and sets the AI status to `MONITORING`.
- The loadout and group size become part of the shared game state used by later screens.

### What the judge should notice

- The player is configuring a simulated survivor state, not submitting personal data.
- The loadout is a gameplay input that visibly affects resource values in the HUD.

### Expected result

- The survivor profile is persisted in Zustand state and the briefing screen opens.

---

## 3. Flood briefing

**Route:** `/briefing`

### What the user clicks

1. Wait for the field brief to finish receiving.
2. Click **CONTINUE**. The button is temporarily labeled **RECEIVING BRIEF...** for approximately 1.85 seconds and is disabled during that period.

### What should appear

- `RAKSHAK / SURVIVAL BRIEFING` and `DAY 01`.
- The incoming field brief for `ZONE 04`.
- Status cards showing:
  - `WEATHER / HEAVY RAIN`
  - `FLOOD RISK / HIGH`
  - `WATER LEVEL / RISING`
  - `RAKSHAK AI / ONLINE`
- The directive: `Your survival challenge begins now.`
- The loop statement: `Real-world condition → AI analysis → game state → your decision.`
- `RAKSHAK LINK STABLE / MOCK AI MODE`.

### AI behavior demonstrated

- The screen introduces the interaction contract: real-world condition input will be analyzed, then the game state and player decision will change.
- This page is a briefing surface; it does not call the AI service or alter the mission by itself.

### What the judge should notice

- The app clearly labels the AI as mock/local mode.
- The simulation separates briefing information from later typed state-changing actions.

### Expected result

- Clicking **CONTINUE** navigates to `/survival`.
- Visiting `/briefing` without an initialized survivor redirects back to `/setup`.

---

## 4. Survival HUD

**Route:** `/survival`

### What the user clicks

For the canonical run:

1. Review the current map, RAKSHAK panel, mission card, resource status and community objective.
2. Click **ACCEPT MISSION** on the mission card.
3. Click **FOLLOW AI ROUTE** in the operational readout if you want to show the route recommendation being acknowledged.
4. Use **OPEN DECISION EVENT** on the mission card when ready for the route challenge.
5. Use **DEMO CONTROL** in the bottom dock, or **OPEN DEMO CONTROLS →** in the condition banner, to move to Judge Demo mode later.

### What should appear

Initial seeded state includes:

- `CURRENT CONDITION / AI MONITORING`.
- Weather `HEAVY`, flood level `HIGH`.
- Mission `REACH SHELTER A`, initially `AVAILABLE`.
- Objective: reach Shelter A and check in at the safe-zone beacon.
- Recommended route `B`.
- Route map with Route B highlighted as the safer high-ground line.
- Community objective `24/30 SURVIVORS SAFE`.
- Resource values from the selected setup loadout.
- RAKSHAK panel with `MOCK / LOCAL`, a live directive and the current recommended route.
- The water-level telemetry placeholder initially reads `TELEMETRY STANDBY`; the chart is deferred until it approaches the viewport, then renders the Recharts telemetry graph.

After **ACCEPT MISSION**:

- Mission status changes from `AVAILABLE` to `ACTIVE`.
- RAKSHAK changes to `RECOMMENDING`.
- The directive becomes `Mission accepted. Route B is plotted on higher ground.`.
- The field log records `MISSION ACCEPTED / OBJECTIVE TRACKING ACTIVE`.

After **FOLLOW AI ROUTE**:

- The recommended route remains or changes to the selected route.
- The directive confirms the route is plotted and points toward the next verified beacon.

### AI behavior demonstrated

- `acceptMission` changes the mission state and AI directive.
- `followRoute` updates the recommended route and route-following directive.
- `TacticalMap` reads roads, shelters, reports, flood level, recommended route and escalation state directly from the shared store.
- The telemetry chart visualizes the current `floodTimeline` without requiring a chart API or remote data source.

### What the judge should notice

- The map, mission card, AI directive, field log and resource HUD are all reading the same state.
- Route B is recommended because it uses higher ground and a verified beacon, not simply because it is shortest.
- The `SIMULATED DATA` label can be toggled from the shell header; it changes the presentation label only and does not pretend to connect to live services.

### Expected result

- The player has an active mission and a visible, explainable Route B recommendation before the decision event.

---

## 5. Current AI / Game Master interaction

The current Game Master is **RAKSHAK**, implemented as a state-driven directive panel rather than a free-form chat interface.

### What the user clicks

#### Route and directive interaction

1. In the RAKSHAK panel, click **SCAN AREA** to open `/scanner`.
2. Alternatively, click **SHOW ROUTE** to open `/decision`.
3. On the HUD, click **FOLLOW AI ROUTE** to acknowledge the current recommendation.

#### AI-assisted flood scan

1. On `/scanner`, click **USE DEMO IMAGE** for the deterministic path, or choose a local image with **CHOOSE FILE**.
2. Wait for `ANALYZING IMAGE...` to finish.
3. Review the classification and click **CONFIRM** or **DISCARD**.
4. If confirmed, click **VIEW MAP →** to inspect the map state.

### What should appear

During image analysis:

- Scanner status is `SCANNING`.
- The UI shows `ANALYZING IMAGE...` and a progress indicator.
- The RAKSHAK status is `ANALYZING`.

After the deterministic scan completes:

- Scanner status is `READY`.
- Classification is `FLOODED ROAD`.
- Confidence is `87%`.
- Summary: standing water spans the lower lane and a vehicle obstruction is visible beyond the caution marker.
- The screen explicitly says this is AI-assisted classification only and requires human confirmation.

After **CONFIRM**:

- The report is added to the verified reports list.
- The map displays a human-confirmed hazard report marker.
- Player XP increases by `75`.
- Community score increases by `8`.
- `HAZARD REPORTER` is unlocked.
- RAKSHAK reports that the verified hazard was added and Route B remains safer.

After **DISCARD**:

- No map report is added.
- The scanner returns to `IDLE`.
- RAKSHAK reports that the map is unchanged.

### AI behavior demonstrated

- `analyzeFloodImage` runs behind the typed `AiService` contract and returns a deterministic `ScanResult`.
- `confirmScan` is a separate human-confirmation gate. The scan does not change map state until the player confirms it.
- `chooseRoute` calls the AI decision evaluator and changes scores, XP, status and event history based on the selected route.

### What the judge should notice

- The AI recommends and classifies; it does not silently take emergency action.
- Verified information has a direct but controlled effect on the tactical map and progression.
- RAKSHAK status labels (`MONITORING`, `ANALYZING`, `RECOMMENDING`, `SUCCESS`, `WARNING`, `MISSION UPDATED`) make the state transition visible.

### Expected result

- The judge can see a complete condition → AI analysis → human confirmation → map update loop.

---

## 6. Mission / decision flow

**Routes:** `/mission` and `/decision`

### What the user clicks

1. Open `/mission` through the shell navigation or **OPEN DECISION EVENT** from the mission card.
2. If the mission is `AVAILABLE`, click **ACCEPT MISSION**.
3. Click **OPEN DECISION EVENT**.
4. On `/decision`, select one of the route cards:
   - **Route A / SHORT ROUTE**
   - **Route B / SAFE ROUTE**
   - **Route C / NORTH LOOP**
5. For the canonical safety-first result, select **Route B** and click **EVALUATE DECISION**.
6. Wait for `ANALYZING DECISION...` to complete.
7. From the result, optionally click **SCAN ENVIRONMENT** or **VIEW ROUTE**.
8. Return to `/mission` through the shell navigation.

### What should appear

- The mission deck displays the mission status, objective, distance, reward, risk and route visualization.
- The checklist marks the mission and route intelligence as received/analyzed.
- The decision page labels the event `WATER LEVEL IS RISING` and warns that the shortest line crosses a low bridge.
- Route B carries the `AI PICK` label in the seeded state.
- While the AI evaluates, the page shows `RAKSHAK / ANALYZING DECISION...` and compares distance, flood reports, road status and shelter capacity.
- For Route B, the result is normally:
  - `GOOD DECISION`
  - Safety score `92`
  - Decision score `94`
  - `+100 XP`
  - Explanation that Route B stays on higher ground and keeps a verified shelter beacon in range.
- For Route A, the evaluator returns `RISK DETECTED`, a lower safety score and `+35 XP` because the route enters the low-bridge flood pocket.
- Route C is the balanced, longer alternative and normally returns a good decision with a lower score than Route B.

### AI behavior demonstrated

- `evaluateDecision` is called with the full current `GameState` and selected `RouteId`.
- The result is typed as `GOOD_DECISION` or `RISK_DETECTED` and directly updates XP, safety score, decision score, navigation score, AI status, the directive and the event log.
- During active escalation, choosing Route A is explicitly treated as dangerous even if the player previously selected it.

### What the judge should notice

- The game rewards safety and verified information rather than the shortest route.
- The decision is not a cosmetic choice: the output changes scores, XP, status and the logged event.
- The AI output remains explainable through the reason text shown in the result panel.

### Expected result

- A route decision is persisted in the shared state. Do not complete the mission yet if you want to demonstrate the staged Judge Demo escalation first; complete the regenerated mission in step 9.

---

## 7. Judge Demo mode

**Route:** `/demo`

### What the user clicks

1. Open Judge Demo mode using **DEMO CONTROL** in the bottom dock, or **OPEN DEMO CONTROLS →** from the HUD condition banner.
2. Review the control panel and live state readout.
3. Optionally change one or more controls:
   - `RAINFALL`
   - `FLOOD LEVEL`
   - `ROAD A`
   - `ROAD B`
   - `SHELTER A`
   - `SHELTER B`
   - `COMMUNITY REPORTS`
   - `PLAYER BATTERY`
4. Wait for the readout to move through `ANALYZING` and settle.
5. For the canonical escalation, click **SIMULATE FLOOD ESCALATION**.
6. Do not click **RESET** until the escalation and results have been demonstrated.

### What should appear

The left side shows `SIMULATE REAL-WORLD CONDITIONS` with explicit `SIMULATED DATA / NOT EMERGENCY INSTRUCTIONS` labeling.

The right side shows:

- Current mission title and description.
- RAKSHAK response.
- Current weather.
- Current flood level.
- Current recommended route.
- Water-level/risk telemetry.
- The explanation that AI outputs are deterministic mock data behind a replaceable service interface.

When a select changes:

- The selected real-world/game condition changes immediately in the shared state.
- RAKSHAK shows `Simulation input changed. RAKSHAK is recalculating mission risk.` while processing.
- The flood timeline receives a new point.
- `generateMission` recalculates the mission and recommended route after its local delay.
- The readout and mission copy update without a page reload.

### AI behavior demonstrated

- `setDemoControl` is the judge-facing bridge from simulated environmental inputs to the game engine.
- It updates weather, flood level, roads, shelters, community uncertainty and battery, then calls `mockAiService.generateMission`.
- The service calculates risk from flood level, blocked roads, full shelters and low battery, then returns a structured mission output.

### What the judge should notice

- The AI is not a decorative chatbot: changing inputs changes the mission context, recommendation and telemetry.
- The app exposes the exact variables that feed the mock AI so the cause-and-effect relationship is easy to inspect.
- Every readout remains labeled as simulated data.

### Expected result

- A control change produces a visible, deterministic RAKSHAK response and updated mission recommendation.
- Clicking **SIMULATE FLOOD ESCALATION** begins the three-stage event described next.

---

## 8. Flood escalation

**Triggered from:** `/demo`

### What the user clicks

1. Click **SIMULATE FLOOD ESCALATION**.
2. Wait for all three stages to finish. The complete sequence takes approximately 1.4 seconds of local simulated processing.
3. Navigate to `/survival` or `/mission` to show the updated objective.

### What should appear

#### Stage 01 / immediate response

- The demo enters `escalationActive` mode.
- RAKSHAK status becomes `WARNING`.
- The response says: `Flood escalation detected. Locking the map and recalculating all routes.`.
- The field log records `FLOOD ESCALATION / STAGE 01 OF 03`.
- The UI shifts into the emergency visual state.

#### Stage 02 / state mutation

After the first local delay:

- Weather becomes `EXTREME`.
- Flood level becomes `CRITICAL`.
- Road A becomes `BLOCKED` with critical risk.
- Shelter A becomes `FULL` at `95%` capacity.
- The response says: `Road A is blocked. Shelter A is 95 percent full. Searching for a viable extraction.`.
- The flood timeline receives a critical-risk point.

#### Stage 03 / mission regeneration

After the second local delay:

- RAKSHAK status becomes `MISSION UPDATED`.
- The current mission is regenerated as `mission-02`.
- Mission title becomes `REACH SHELTER B`.
- Description becomes: `Shelter A is no longer a reliable extraction point. Move to the higher-capacity eastern beacon.`.
- Objective becomes: `Reach Shelter B before the lower district submerges.`.
- Route B becomes the recommended route.
- Mission status becomes `AVAILABLE`.
- The response says: `Your previous route is no longer recommended. This situation has changed. New survival mission generated.`.

On `/survival`:

- The top condition banner becomes `EMERGENCY EVENT / FLOOD ESCALATION`.
- It says the previous route is no longer recommended.
- The map shows the `LIVE ESCALATION` label, Road A blocked and Shelter A at capacity.
- The operational readout changes the movement window to `Immediate movement required`.

### AI behavior demonstrated

- `simulateFloodEscalation` mutates the shared game state in three deliberate stages.
- `generateMission` is called against the changed state rather than replaying the old mission.
- The AI risk calculation sees critical flood conditions, a blocked road and a full shelter, then regenerates a higher-capacity Shelter B objective.

### What the judge should notice

- This is the core proof that AI changes the game: the world condition changes, the old plan is invalidated, routes are recalculated and the mission is regenerated.
- The system does not keep recommending Shelter A after it becomes full.
- The state change is visible in the map, mission card, RAKSHAK message, header status, field log and telemetry.

### Expected result

- The old Shelter A plan is replaced by an available Shelter B mission with Route B recommended.

---

## 9. Results / readiness

**Routes:** `/mission`, `/results`, `/achievements`

### What the user clicks

1. On `/mission`, click **ACCEPT MISSION** for the regenerated Shelter B mission.
2. Click **OPEN DECISION EVENT**.
3. Select **Route B / SAFE ROUTE** and click **EVALUATE DECISION**.
4. Return to `/mission` through the shell navigation.
5. Click **COMPLETE MISSION**.
6. Click **VIEW SURVIVAL RESULTS**.
7. On the results page, click **VIEW COMMUNITY LEADERBOARD** to open `/achievements`.
8. Optionally click **RETURN TO HUD**.

### What should appear

After accepting the regenerated mission:

- Mission status becomes `ACTIVE`.
- The mission card shows the Shelter B objective and progress bar.

After completing it:

- Mission status becomes `COMPLETE`.
- RAKSHAK reports: `Mission complete. You prioritized verified information and moved people toward safer ground.`.
- XP and safety score increase.
- `FIRST SURVIVAL` is unlocked.
- `FLOOD GUARDIAN` is unlocked when the mission was completed after escalation.
- The field log records `MISSION COMPLETE / SURVIVAL SCORE CALCULATED`.

On `/results`:

- The page shows `FLOOD GUARDIAN / OBJECTIVE SECURED` and `SURVIVAL COMPLETE`.
- Score panels show Safety Score, Decision Quality, Navigation and Community.
- The progression panel shows the current level and Flood Guardian status.
- Achievement pills show the badges earned during the run.
- If the mission is not complete, `/results` redirects to `/mission` instead of showing an incomplete result.

On `/achievements`:

- The named survivor profile, XP, safety index and unlocked badges appear.
- The safety-first leaderboard is visible.
- Rankings are presented as safety, verified reports and preparedness rather than dangerous behavior.

### AI behavior demonstrated

- Completing a mission uses the current mission reward and escalation state to update progression.
- The final result is a summary of the decisions, verified reports and safety-first actions that occurred in the shared state.

### What the judge should notice

- The final screen closes the loop from environmental input to AI recommendation, player decision, escalation and measurable outcome.
- Results are not a separate static page; they are gated by the persisted mission status.
- The app is ready for a repeat run because the demo state can be reset locally.

### Expected result

- A complete high-risk scenario ends on a successful Shelter B result with visible safety scores and achievement state.

---

# Current implementation reference

## Tech stack

- React `19.2.8`
- TypeScript `~6.0.2`
- Vite `8.3.0`
- Tailwind CSS `4.3.3` with `@tailwindcss/vite`
- `motion` `13.2.0`, using the `motion/react` API for Framer Motion-style transitions and animation
- Lucide React `0.577.0`
- Recharts `3.10.1`
- React Router DOM `7.18.3` in declarative mode
- Zustand `5.0.15` with persist middleware
- `vite-plugin-svgr` `5.2.0` for SVG component loading
- Oxlint for linting

The project has no newly added dependency for this runbook.

## Existing routes

| Route | Surface | Access behavior |
| --- | --- | --- |
| `/` | Landing page | Public entry point |
| `/setup` | Survivor setup | Public; initializes the run |
| `/briefing` | Flood briefing | Redirects to `/setup` if `hasStarted` is false |
| `/survival` | Main survival HUD | Gameplay route; redirects to `/setup` if not started |
| `/map` | Tactical map | Gameplay route |
| `/mission` | Mission deck | Gameplay route |
| `/decision` | Decision challenge | Gameplay route |
| `/scanner` | AI flood scanner | Gameplay route |
| `/community` | Community survival | Gameplay route |
| `/inventory` | Survival kit | Gameplay route |
| `/results` | Survival results | Gameplay route; redirects to `/mission` unless the mission is complete |
| `/achievements` | Achievements and leaderboard | Gameplay route |
| `/demo` | Judge Demo mode | Gameplay route |
| `/settings` | Accessibility and reset controls | Gameplay route |

Unknown paths navigate back to `/`. Routes are lazy-loaded in `src/App.tsx` behind an accessible loading state.

## Existing important components

- `src/App.tsx` — Browser Router, lazy route boundaries, protected gameplay routes, route transitions and reduced-motion configuration.
- `src/components/layout/GameShell.tsx` — Shared HUD shell, desktop navigation, simulated-data label, resource header, bottom status dock and Settings/Demo links.
- `src/components/layout/MobileBottomNav.tsx` — Mobile navigation for HUD, map, missions, community and profile/inventory.
- `src/components/effects/StormAtmosphere.tsx` — Rain, fog, scanline and storm atmosphere layers.
- `src/components/ai/RakshakPanel.tsx` — RAKSHAK directive panel, AI status, current message, recommended route and scanner/decision links.
- `src/components/map/TacticalMap.tsx` — Offline vector SVG tactical map with routes, shelters, roads, reports, flood layer and escalation markers.
- `src/components/missions/MissionCard.tsx` — Mission status, objective, reward, accept/complete/result actions and decision link.
- `src/components/missions/RouteChoiceCard.tsx` — Route A/B/C selection cards with risk, distance and AI Pick state.
- `src/components/charts/LazyWaterTelemetryChart.tsx` — Intersection-aware chart loader and telemetry placeholder.
- `src/components/charts/WaterTelemetryChart.tsx` — Recharts area chart for water level and risk.
- `src/components/ui/Panel.tsx` — HUD panel container.
- `src/components/ui/GlowButton.tsx` — Reusable action button variants.
- `src/components/ui/StatusPill.tsx` — Semantic status labels.
- `src/components/ui/ProgressBar.tsx` — Accessible progress display.
- `src/components/ui/StatValue.tsx` — Reusable resource and score stat row.

## Existing state management

`src/store/gameStore.ts` creates `useGameStore`, a typed Zustand store wrapped in `persist` middleware.

Persisted state includes:

- Survivor profile and resources.
- Weather, flood level, roads and shelters.
- Route options and recommended route.
- Current mission and mission status.
- Community progress and completed community actions.
- Verified hazard reports.
- AI status, directive message, thinking state and last action.
- Last route decision and scores.
- Flood timeline.
- Escalation state, achievements and settings.

Important store actions include:

- `initializeSurvival`
- `acceptMission`
- `followRoute`
- `chooseRoute`
- `analyzeFloodImage`
- `confirmScan`
- `discardScan`
- `completeCommunityAction`
- `useInventoryItem`
- `setDemoControl`
- `simulateFloodEscalation`
- `completeMission`
- `setSettings`
- `setDemoMode`
- `resetGame`

## Existing mock data

`src/data/mockData.ts` exposes `createInitialState()` with the seeded Zone 04 scenario:

- Player: `UNIDENTIFIED SURVIVOR`, level 1, 120 XP, 86 health, 68 battery, water 2, food 1, first aid 1, flashlight 1 and powerbank 1.
- Weather: `HEAVY`.
- Flood level: `HIGH`.
- Road A: low bridge, `OPEN`, high risk.
- Road B: high ground, `OPEN`, low risk.
- Road C: north loop, `CAUTION`, medium risk.
- Shelter A: 58% capacity, available.
- Shelter B: 45% capacity, available.
- Community: 24 safe, 14 evacuating, 6 unverified, 3 needing information, target 30 safe.
- Base mission: `REACH SHELTER A`, 1.4 km, medium risk, +150 XP, initially available.
- Routes:
  - A / Short Route — 1.1 km, high risk, 18 minutes.
  - B / Safe Route — 1.8 km, low risk, 28 minutes.
  - C / North Loop — 2.2 km, medium risk, 34 minutes.
- Flood telemetry begins with five seeded time points from 18:30 through 19:30.
- Demo mode is initially enabled and the initial AI status is `MONITORING`.

## Existing AI abstractions

`src/types/game.ts` defines the replaceable `AiService` interface:

- `generateMission(state)` → typed `AiMissionOutput`.
- `evaluateDecision(state, decision)` → typed `AiDecisionOutput`.
- `analyzeFloodImage(input)` → typed `ScanResult`.
- `generateAssistantResponse(state, userMessage?)` → typed `AiAssistantOutput`.
- `calculateRisk(state)` → typed `RiskLevel`.

`src/services/aiService.ts` provides `mockAiService`, a deterministic local implementation with simulated delays:

- Risk is calculated from flood level, blocked roads, full shelters and low battery.
- Mission generation promotes Shelter B when conditions become critical.
- Route evaluation rewards Route B and flags Route A's low-bridge exposure.
- Flood image analysis returns the fixed `FLOODED_ROAD` / `87%` demo classification.
- Assistant responses describe route recommendations, success or mission updates.

The store is the integration layer that applies these typed outputs to the persisted game state.

## What is already working

- Complete local flow from landing through setup, briefing, HUD, route decision, scanner, Judge Demo escalation and results.
- Shared state changes are visible across the HUD, map, mission deck, scanner, community page, inventory, results and achievements.
- Deterministic AI output materially changes mission copy, route recommendation, risk state, XP, scores, reports and achievements.
- Human confirmation is required before a scanner result changes the tactical map.
- Judge Demo controls update environmental inputs, telemetry and mission generation live.
- Flood escalation runs as a staged event and regenerates the Shelter B mission.
- Zustand persistence survives reloads; reset controls are available.
- Route-level lazy loading and deferred Recharts telemetry are implemented.
- Responsive desktop/mobile navigation, reduced motion preference, keyboard-focusable primary actions and semantic status text are implemented.
- The current browser QA flow has been exercised through the main gameplay, escalation, results, chart loading and responsive paths without console errors or failed network requests.

## Known limitations

- The AI is deterministic mock logic. It does not call a real LLM, external flood feed, weather service or geospatial service.
- Flood image analysis ignores image pixels and returns the fixed demo classification. Camera access is not required.
- Uploaded scan confirmations are currently stored with the `DEMO_IMAGE` source value because `confirmScan` does not retain the original source type.
- `generateAssistantResponse` exists in the service contract but there is no free-form chat input; RAKSHAK messages are driven by store actions.
- `followRoute` changes the recommendation and directive but does not simulate physical movement along the route.
- Mission completion is intentionally a simple game action once the mission is active; the store does not enforce that a scanner report or second route decision must be completed first.
- Inventory, battery, community actions and health are simplified game mechanics, not medical, evacuation or emergency guidance.
- The Sound setting is persisted, but no audio playback system is currently attached to it.
- Judge Demo select changes regenerate mission recommendations, but the staged escalation button is the canonical path for demonstrating the full three-stage event.
- Local storage persistence can make a later run start with prior progress; use the reset controls before presenting a clean run.

## Recommended next implementation step

Before any major UI or architecture change, preserve this runbook as the baseline acceptance path. The highest-value next implementation step is to add a small automated smoke-test harness around the existing critical transitions—`initializeSurvival`, `chooseRoute`, `confirmScan`, `simulateFloodEscalation` and `completeMission`—without changing the current UI or mock service behavior. This would protect the already-working hackathon demo while future improvements are made.
