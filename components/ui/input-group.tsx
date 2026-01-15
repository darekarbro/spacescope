"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

export function InputGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center space-x-2", className)}>{children}</div>
}

export function InputGroupAddon({ children, align = "inline-end", className }: { children: React.ReactNode; align?: string; className?: string }) {
  return <div className={cn("flex items-center", className)}>{children}</div>
}

export function InputGroupButton({ children, variant = "default", className, ...props }: any) {
  return (
    <Button variant={variant} className={cn(className)} {...props}>
      {children}
    </Button>
  )
}

export function InputGroupInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input data-slot="input" className={cn("w-full rounded-md border px-3 py-2", props.className)} {...props} />
}

export default InputGroup
