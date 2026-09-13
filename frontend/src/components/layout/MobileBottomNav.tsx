import { Home, Map, Radio, Shield, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/survival', label: 'HOME', icon: Home },
  { to: '/map', label: 'MAP', icon: Map },
  { to: '/mission', label: 'MISSIONS', icon: Radio },
  { to: '/community', label: 'COMMUNITY', icon: Users },
  { to: '/inventory', label: 'PROFILE', icon: Shield },
]

export function MobileBottomNav() {
  return (
    <nav className="mobile-only fixed inset-x-3 bottom-3 z-30 rounded border border-white/15 bg-[#03101d]/90 p-1.5 shadow-2xl backdrop-blur-xl" aria-label="Mobile survival navigation">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded text-[0.55rem] font-semibold tracking-[0.12em] transition ${isActive ? 'bg-cyan/10 text-cyan' : 'text-muted hover:bg-white/5 hover:text-white'}`}
          >
            <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
