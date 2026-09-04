import type { InputHTMLAttributes } from 'react'
export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`flex h-9 w-full rounded-md border border-border bg-background px-3 py-1 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring ${className}`} {...props} />
}
