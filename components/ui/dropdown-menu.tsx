"use client"

import * as React from "react"

type MenuContextType = {
  open: boolean
  setOpen: (v: boolean) => void
}

const MenuContext = React.createContext<MenuContextType | null>(null)

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  children,
  asChild = false,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const ctx = React.useContext(MenuContext)
  if (!ctx) return <>{children}</>

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    ctx.setOpen(!ctx.open)
  }

  if (asChild && React.isValidElement(children)) {
    // cast to any to satisfy TypeScript overloads for cloneElement
    return React.cloneElement(children as any, {
      onClick: (e: any) => {
        ;(children as any).props.onClick?.(e)
        toggle(e)
      },
    } as any)
  }

  return (
    <button onClick={toggle} className="inline-flex items-center">
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ctx = React.useContext(MenuContext)
  if (!ctx) return null

  if (!ctx.open) return null

  return (
    <div
      className={`absolute right-0 z-50 mt-2 w-56 rounded-lg bg-popover p-2 shadow-lg ${className}`}
      role="menu"
    >
      {children}
    </div>
  )
}

export function DropdownMenuLabel({ children, className }: any) {
  return <div className={`px-2 py-1 text-sm text-muted-foreground ${className || ""}`}>{children}</div>
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-border" />
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div className="py-1">{children}</div>
}

export function DropdownMenuItem({ children, onClick }: any) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
    >
      {children}
    </button>
  )
}

export { DropdownMenu as default }
