import type { HTMLAttributes } from 'react'

type BadgeProps = HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' }
export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const styles = variant === 'outline' ? 'border border-border bg-transparent text-foreground' : 'bg-primary text-primary-foreground'
  return <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition-colors ${styles} ${className}`} {...props} />
}
