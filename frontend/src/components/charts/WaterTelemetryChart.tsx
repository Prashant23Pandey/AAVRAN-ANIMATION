import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { FloodPoint } from '../../types/game'

export function WaterTelemetryChart({ data }: { data: FloodPoint[] }) {
  return (
    <div className="h-52 w-full" aria-label="Water level and flood risk telemetry chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="water-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00f0ff" stopOpacity={0.35} /><stop offset="100%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient>
            <linearGradient id="risk-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#e52b50" stopOpacity={0.28} /><stop offset="100%" stopColor="#e52b50" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(143,166,184,0.12)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: '#8fa6b8', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickMargin={8} />
          <YAxis domain={[0, 100]} tick={{ fill: '#8fa6b8', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
          <Tooltip contentStyle={{ background: '#06111f', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 0, fontFamily: 'JetBrains Mono', fontSize: 11 }} labelStyle={{ color: '#f4f8fb' }} formatter={(value, name) => [`${value}%`, name === 'level' ? 'WATER LEVEL' : 'RISK']} />
          <Area type="monotone" dataKey="level" stroke="#00f0ff" strokeWidth={2} fill="url(#water-area)" isAnimationActive animationDuration={900} />
          <Area type="monotone" dataKey="risk" stroke="#e52b50" strokeWidth={1.5} fill="url(#risk-area)" isAnimationActive animationDuration={1100} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
