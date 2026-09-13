import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { FloodPoint } from '../../types/game'

const WaterTelemetryChart = lazy(() =>
  import('./WaterTelemetryChart').then(({ WaterTelemetryChart: Chart }) => ({ default: Chart })),
)

interface LazyWaterTelemetryChartProps {
  data: FloodPoint[]
}

function TelemetryPlaceholder() {
  return (
    <div className="flex h-52 w-full items-center justify-center border border-white/5 bg-white/[0.015]" aria-label="Telemetry chart loading">
      <div className="text-center">
        <div className="mx-auto h-1.5 w-28 overflow-hidden bg-white/10">
          <div className="h-full w-1/2 animate-pulse bg-cyan shadow-[0_0_12px_#00f0ff]" />
        </div>
        <p className="micro-copy mt-3">TELEMETRY STANDBY</p>
      </div>
    </div>
  )
}

export function LazyWaterTelemetryChart({ data }: LazyWaterTelemetryChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = chartRef.current
    if (!element || shouldLoad) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setShouldLoad(true)
        observer.disconnect()
      },
      { rootMargin: '180px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <div ref={chartRef} className="h-52 w-full">
      {shouldLoad ? (
        <Suspense fallback={<TelemetryPlaceholder />}>
          <WaterTelemetryChart data={data} />
        </Suspense>
      ) : (
        <TelemetryPlaceholder />
      )}
    </div>
  )
}
