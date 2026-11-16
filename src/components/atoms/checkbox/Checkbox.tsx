/**
 * Checkbox — Atom A-05
 * Fluent Design 2 · Checkbox spec
 *
 * Reference: Image 1 (Unchecked, Checked, Indeterminate across Rest, Hover, Pressed, Disabled, Focus)
 * Built on Radix UI Checkbox primitive for 100% accessible keyboard navigation & ARIA states.
 */
import React from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, indeterminate = false, disabled, ...props }, ref) => {
  // Determine checked state (radix handles 'indeterminate' via checked="indeterminate")
  const actualChecked = indeterminate ? 'indeterminate' : checked

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={actualChecked}
      disabled={disabled}
      className={cn(
        // Base geometry: 18x18px with 4px corner radius matching Fluent 2 spec
        'group relative inline-flex size-[18px] shrink-0 items-center justify-center select-none',
        'rounded-[4px] border transition-all duration-[120ms] ease-[cubic-bezier(0,0,0,1)]',
        'outline-none cursor-pointer',

        // ── Unchecked state (Rest) ──
        // Light: white/transparent background with subtle 1.5px stroke
        // Dark: subtle dark background with translucent stroke
        'bg-[var(--fluent-btn-bg)] border-[rgba(0,0,0,0.45)] dark:border-[rgba(255,255,255,0.45)]',
        'shadow-[0_1px_1px_0_rgba(0,0,0,0.04)]',

        // ── Unchecked Hover ──
        'hover:border-[rgba(0,0,0,0.65)] hover:bg-[rgba(0,0,0,0.03)]',
        'dark:hover:border-[rgba(255,255,255,0.65)] dark:hover:bg-[rgba(255,255,255,0.04)]',

        // ── Unchecked Pressed ──
        'active:scale-[0.92] active:border-[rgba(0,0,0,0.80)] dark:active:border-[rgba(255,255,255,0.80)]',

        // ── Checked & Indeterminate states ──
        // Light: Rich Fluent Cobalt Blue (#0067c0)
        // Dark: Vibrant Cyan-Blue (#60cdff)
        'data-[state=checked]:bg-[var(--fluent-accent)] data-[state=checked]:border-[var(--fluent-accent)]',
        'data-[state=checked]:hover:bg-[var(--fluent-accent-hover)] data-[state=checked]:hover:border-[var(--fluent-accent-hover)]',
        'data-[state=checked]:active:bg-[var(--fluent-accent-pressed)] data-[state=checked]:active:border-[var(--fluent-accent-pressed)]',

        'data-[state=indeterminate]:bg-[var(--fluent-accent)] data-[state=indeterminate]:border-[var(--fluent-accent)]',
        'data-[state=indeterminate]:hover:bg-[var(--fluent-accent-hover)] data-[state=indeterminate]:hover:border-[var(--fluent-accent-hover)]',
        'data-[state=indeterminate]:active:bg-[var(--fluent-accent-pressed)] data-[state=indeterminate]:active:border-[var(--fluent-accent-pressed)]',

        // ── Focus ring: 2px ring + 2px offset (Fluent 2 specification) ──
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fluent-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fluent-focus-offset)]',

        // ── Disabled state ──
        'disabled:pointer-events-none disabled:cursor-not-allowed',
        'disabled:border-[rgba(0,0,0,0.18)] disabled:bg-[rgba(0,0,0,0.03)] disabled:shadow-none',
        'dark:disabled:border-[rgba(255,255,255,0.15)] dark:disabled:bg-[rgba(255,255,255,0.03)]',
        'data-[state=checked]:disabled:bg-[rgba(0,0,0,0.20)] data-[state=checked]:disabled:border-transparent',
        'dark:data-[state=checked]:disabled:bg-[rgba(255,255,255,0.12)]',
        'data-[state=indeterminate]:disabled:bg-[rgba(0,0,0,0.20)] data-[state=indeterminate]:disabled:border-transparent',
        'dark:data-[state=indeterminate]:disabled:bg-[rgba(255,255,255,0.12)]',

        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white dark:text-[#002747] animate-in zoom-in-75 duration-100">
        {indeterminate ? (
          <Minus className="size-3 stroke-[3]" />
        ) : (
          <Check className="size-3 stroke-[2.75]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = 'Checkbox'

// ── Checkbox with Label compound ─────────────────────────────────────────────

export interface CheckboxFieldProps extends CheckboxProps {
  label?: React.ReactNode
  description?: React.ReactNode
  id?: string
}

export const CheckboxField = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxFieldProps
>(({ id, label, description, className, disabled, ...props }, ref) => {
  const generatedId = React.useId()
  const fieldId = id || generatedId

  return (
    <div className={cn('inline-flex items-start gap-2.5 select-none', disabled && 'opacity-60 cursor-not-allowed')}>
      <Checkbox id={fieldId} ref={ref} disabled={disabled} {...props} />
      {(label || description) && (
        <div className="grid gap-0.5 leading-none pt-[1px]">
          {label && (
            <label
              htmlFor={fieldId}
              className={cn(
                'font-[\'Segoe_UI_Variable\',_\'Segoe_UI\',_system-ui,_-apple-system,_sans-serif]',
                'text-[14px] leading-[18px] text-[var(--fluent-btn-fg)] cursor-pointer',
                disabled && 'cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-[12px] leading-[16px] text-[var(--neutral-muted)]">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
CheckboxField.displayName = 'CheckboxField'

