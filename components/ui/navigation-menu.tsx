"use client"

import * as React from "react"

type ItemContextType = {
  open: boolean
  setOpen: (v: boolean) => void
}

const ItemContext = React.createContext<ItemContextType | null>(null)

export function NavigationMenu({ children, className = "", viewport = true }: any) {
  return (
    <nav className={className} aria-label="Primary">
      {children}
      {/* viewport prop is accepted for compatibility */}
      {viewport ? null : null}
    </nav>
  )
}

export function NavigationMenuList({ children, className = "" }: any) {
  return (
    <ul className={`flex items-center gap-1 list-none m-0 p-0 ${className}`}>{children}</ul>
  )
}

export function NavigationMenuItem({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <li className="relative" onMouseLeave={() => setOpen(false)}>
      <ItemContext.Provider value={{ open, setOpen }}>{children}</ItemContext.Provider>
    </li>
  )
}

export function NavigationMenuTrigger({ children, className = "" }: any) {
  const ctx = React.useContext(ItemContext)
  if (!ctx) return <>{children}</>

  return (
    <button
      type="button"
      onMouseEnter={() => ctx.setOpen(true)}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={className}
    >
      {children}
    </button>
  )
}

export function NavigationMenuContent({ children, className = "" }: any) {
  const ctx = React.useContext(ItemContext)
  if (!ctx) return null

  if (!ctx.open) return null

  return (
    <div className={`absolute left-0 top-full mt-2 z-50 rounded-md bg-popover p-2 shadow-md ${className}`}>
      {children}
    </div>
  )
}

export function NavigationMenuLink({ href, children, className = "", ...props }: any) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}

export function NavigationMenuViewport() {
  return <div aria-hidden className="sr-only" />
}

export default NavigationMenu
