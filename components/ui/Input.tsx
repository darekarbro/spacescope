import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = {
  label?: string
  type?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

function Input({ label, className, type, ...props }: InputProps) {
  // Support textarea and select 'type' markers used across the app
  if (type === "textarea") {
    return <textarea data-slot="input" className={cn("w-full rounded-md p-2", className)} {...(props as any)} />
  }

  if (type === "select") {
    return (
      <select data-slot="input" className={cn("w-full rounded-md p-2", className)} {...(props as any)}>
        {/* placeholder: consumer should pass children when using select */}
      </select>
    )
  }

  return (
    <input
      type={type as any}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
