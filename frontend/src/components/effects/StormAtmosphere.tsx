import { motion } from 'motion/react'

export function StormAtmosphere({ intense = false }: { intense?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="rain-layer" style={{ opacity: intense ? 0.46 : undefined }} />
      <div className="fog-layer" />
      <div className="waterline" style={{ height: intense ? '42%' : undefined }} />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#020813] via-transparent to-transparent" />
      <motion.div
        className="absolute -right-28 top-20 h-72 w-72 rounded-full bg-cyan/5 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 22, 0], opacity: [0.22, 0.42, 0.22] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[-8rem] top-1/3 h-56 w-56 rounded-full bg-danger/5 blur-3xl"
        animate={{ x: [0, 35, 0], opacity: [0.1, 0.32, 0.1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="scanlines" />
    </div>
  )
}
