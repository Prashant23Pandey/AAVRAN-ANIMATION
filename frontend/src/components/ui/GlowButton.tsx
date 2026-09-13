import type { MouseEventHandler, ReactNode } from 'react'
import { motion } from 'motion/react'

interface GlowButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  icon?: ReactNode
  children: ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  'aria-label'?: string
}

const variantClasses = {
  primary: 'glow-button',
  secondary: 'glow-button glow-button-secondary',
  danger: 'glow-button glow-button-danger',
  ghost: 'glow-button glow-button-ghost',
}

export function GlowButton({ variant = 'primary', icon, children, className = '', type = 'button', ...props }: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      className={`${variantClasses[variant]} ${className}`.trim()}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </motion.button>
  )
}
