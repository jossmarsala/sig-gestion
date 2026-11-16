/**
 * Radio Group & Radio Button — Atom A-06
 * Fluent Design 2 · RadioButton spec
 *
 * Reference: Image 2 (Unchecked, Checked across Rest, Hover, Pressed, Disabled, Focus)
 * Built on Radix UI RadioGroup primitive with concentric accent ring & inner dot.
 */
import React from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2.5', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {}

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Base geometry: 18x18px circle matching Fluent 2 spec
        'group relative inline-flex size-[18px] shrink-0 items-center justify-center select-none',
        'rounded-full border-[1.5px] transition-all duration-[120ms] ease-[cubic-bezier(0,0,0,1)]',
        'outline-none cursor-pointer',

        // ── Unchecked Rest ──
        'bg-[var(--fluent-btn-bg)] border-[rgba(0,0,0,0.45)] dark:border-[rgba(255,255,255,0.45)]',
        'shadow-[0_1px_1px_0_rgba(0,0,0,0.04)]',

        // ── Unchecked Hover ──
        'hover:border-[rgba(0,0,0,0.65)] hover:bg-[rgba(0,0,0,0.03)]',
        'dark:hover:border-[rgba(255,255,255,0.65)] dark:hover:bg-[rgba(255,255,255,0.04)]',

        // ── Unchecked Pressed ──
        'active:scale-[0.92] active:border-[rgba(0,0,0,0.80)] dark:active:border-[rgba(255,255,255,0.80)]',

        // ── Checked State (Concentric ring + inner dot) ──
        'data-[state=checked]:border-[var(--fluent-accent)]',
        'data-[state=checked]:hover:border-[var(--fluent-accent-hover)]',
        'data-[state=checked]:active:border-[var(--fluent-accent-pressed)]',

        // ── Focus ring: 2px ring + 2px offset (Fluent 2 specification) ──
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fluent-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fluent-focus-offset)]',

        // ── Disabled ──
        'disabled:pointer-events-none disabled:cursor-not-allowed',
        'disabled:border-[rgba(0,0,0,0.18)] disabled:bg-[rgba(0,0,0,0.03)] disabled:shadow-none',
        'dark:disabled:border-[rgba(255,255,255,0.15)] dark:disabled:bg-[rgba(255,255,255,0.03)]',
        'data-[state=checked]:disabled:border-[rgba(0,0,0,0.22)] dark:data-[state=checked]:disabled:border-[rgba(255,255,255,0.15)]',

        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* Solid 8px concentric inner dot */}
        <span
          className={cn(
            'size-2 rounded-full transition-transform duration-100 ease-out',
            'bg-[var(--fluent-accent)] group-hover:bg-[var(--fluent-accent-hover)] group-active:bg-[var(--fluent-accent-pressed)]',
            'group-disabled:bg-[rgba(0,0,0,0.22)] dark:group-disabled:bg-[rgba(255,255,255,0.18)]'
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = 'RadioGroupItem'

// ── Radio Group Field (Item + Label compound) ─────────────────────────────────

export interface RadioGroupFieldProps extends RadioGroupItemProps {
  label?: React.ReactNode
  description?: React.ReactNode
  id?: string
}

export const RadioGroupField = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupFieldProps
>(({ id, label, description, className, disabled, ...props }, ref) => {
  const generatedId = React.useId()
  const itemId = id || generatedId

  return (
    <div className={cn('inline-flex items-start gap-2.5 select-none', disabled && 'opacity-60 cursor-not-allowed')}>
      <RadioGroupItem id={itemId} ref={ref} disabled={disabled} {...props} />
      {(label || description) && (
        <div className="grid gap-0.5 leading-none pt-[1px]">
          {label && (
            <label
              htmlFor={itemId}
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
RadioGroupField.displayName = 'RadioGroupField'

