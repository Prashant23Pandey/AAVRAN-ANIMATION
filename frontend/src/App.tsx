import { lazy, Suspense, useEffect } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import { AlertBanner } from './components/ui/AlertBanner'

const LandingPage = lazy(() => import('./pages/LandingPage').then(({ LandingPage }) => ({ default: LandingPage })))
const SetupPage = lazy(() => import('./pages/SetupPage').then(({ SetupPage }) => ({ default: SetupPage })))
const BriefingPage = lazy(() => import('./pages/BriefingPage').then(({ BriefingPage }) => ({ default: BriefingPage })))
const SurvivalPage = lazy(() => import('./pages/SurvivalPage').then(({ SurvivalPage }) => ({ default: SurvivalPage })))
const MapPage = lazy(() => import('./pages/MapPage').then(({ MapPage }) => ({ default: MapPage })))
const MissionPage = lazy(() => import('./pages/MissionPage').then(({ MissionPage }) => ({ default: MissionPage })))
const DecisionPage = lazy(() => import('./pages/DecisionPage').then(({ DecisionPage }) => ({ default: DecisionPage })))
const ScannerPage = lazy(() => import('./pages/ScannerPage').then(({ ScannerPage }) => ({ default: ScannerPage })))
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(({ CommunityPage }) => ({ default: CommunityPage })))
const InventoryPage = lazy(() => import('./pages/InventoryPage').then(({ InventoryPage }) => ({ default: InventoryPage })))
const ResultsPage = lazy(() => import('./pages/ResultsPage').then(({ ResultsPage }) => ({ default: ResultsPage })))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then(({ AchievementsPage }) => ({ default: AchievementsPage })))
const DemoPage = lazy(() => import('./pages/DemoPage').then(({ DemoPage }) => ({ default: DemoPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(({ SettingsPage }) => ({ default: SettingsPage })))

function GameplayRoute({ children }: { children: ReactNode }) {
  const hasStarted = useGameStore((state) => state.hasStarted)
  return hasStarted ? children : <Navigate to="/setup" replace />
}

function DisasterCheck() {
  const hasStarted = useGameStore((state) => state.hasStarted)
  const floodLevel = useGameStore((state) => state.floodLevel)
  const checkDisasterTriggers = useGameStore((state) => state.checkDisasterTriggers)

  useEffect(() => {
    if (!hasStarted) return
    checkDisasterTriggers()
  }, [hasStarted, floodLevel, checkDisasterTriggers])

  return null
}

function RouteLoading() {
  return (
    <main className="screen-shell grid min-h-svh place-items-center px-4" role="status" aria-live="polite">
      <div className="content-layer text-center">
        <motion.div
          className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-cyan border-t-transparent text-cyan"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_16px_#00f0ff]" aria-hidden="true" />
        </motion.div>
        <p className="eyebrow mt-5 text-cyan">LOADING EMERGENCY MODULE</p>
        <p className="micro-copy mt-2">RAKSHAK is syncing the tactical emergency surface.</p>
      </div>
    </main>
  )
}

function RoutedExperience() {
  const location = useLocation()
  const motionPreference = useGameStore((state) => state.settings.motion)

  return (
    <MotionConfig reducedMotion={motionPreference === 'REDUCED' ? 'always' : 'user'}>
      <Suspense fallback={<RouteLoading />}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/briefing" element={<BriefingPage />} />
              <Route path="/survival" element={<GameplayRoute><SurvivalPage /></GameplayRoute>} />
              <Route path="/map" element={<GameplayRoute><MapPage /></GameplayRoute>} />
              <Route path="/mission" element={<GameplayRoute><MissionPage /></GameplayRoute>} />
              <Route path="/decision" element={<GameplayRoute><DecisionPage /></GameplayRoute>} />
              <Route path="/scanner" element={<GameplayRoute><ScannerPage /></GameplayRoute>} />
              <Route path="/community" element={<GameplayRoute><CommunityPage /></GameplayRoute>} />
              <Route path="/inventory" element={<GameplayRoute><InventoryPage /></GameplayRoute>} />
              <Route path="/results" element={<GameplayRoute><ResultsPage /></GameplayRoute>} />
              <Route path="/achievements" element={<GameplayRoute><AchievementsPage /></GameplayRoute>} />
              <Route path="/demo" element={<GameplayRoute><DemoPage /></GameplayRoute>} />
              <Route path="/settings" element={<GameplayRoute><SettingsPage /></GameplayRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </MotionConfig>
  )
}

function App() {
  return (
    <BrowserRouter>
      <DisasterCheck />
      <AlertBanner />
      <RoutedExperience />
    </BrowserRouter>
  )
}

export default App
