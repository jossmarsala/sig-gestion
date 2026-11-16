/**
 * Select — Atom A-09 (Dropdown / ComboBox)
 * Fluent Design 2 · Dropdown spec
 *
 * Three trigger variants from image reference:
 *   default    – Text + chevron  (most common)
 *   with-icon  – Leading icon + Text + chevron
 *   icon-only  – Leading icon + chevron (compact)
 *
 * Flyout panel uses surface-flyout (acrylic/elevated).
 * Items have hover highlight and check indicator on selected.
 * Supports light + dark mode.
 *
 * Built on Radix Select primitive.
 */
import * as React from 'react'
import { Select as SelectPrimitive } from 'radix-ui'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Root, Group, Value (pass-through) ───────────────────────────────────────

const Select       = SelectPrimitive.Root
const SelectGroup  = SelectPrimitive.Group
const SelectValue  = SelectPrimitive.Value

// ─── Trigger ─────────────────────────────────────────────────────────────────

export type SelectTriggerVariant = 'default' | 'with-icon' | 'icon-only'

interface SelectTriggerProps
  extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  /** Leading icon element (shown for 'with-icon' and 'icon-only' variants) */
  leadingIcon?: React.ReactNode
  /** Trigger layout variant */
  triggerVariant?: SelectTriggerVariant
  /** Height size */
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-7  text-[12px] leading-[16px] px-2.5 gap-1.5',
  md: 'h-8  text-[14px] leading-[20px] px-3   gap-2',
  lg: 'h-9  text-[14px] leading-[20px] px-3.5 gap-2',
}

const iconOnlySizeMap = {
  sm: 'size-7  p-0 justify-center gap-1',
  md: 'size-8  p-0 justify-center gap-1',
  lg: 'size-9  p-0 justify-center gap-1.5',
}

function SelectTrigger({
  className,
  children,
  leadingIcon,
  triggerVariant = 'default',
  size = 'md',
  ...props
}: SelectTriggerProps) {
  const isIconOnly = triggerVariant === 'icon-only'

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-trigger-variant={triggerVariant}
      className={cn(
        // Base trigger: 5px radius, smooth fading borders (matching STYLE_GUIDE & reference images)
        // Light: continuous border with smooth fading bottom lip
        // Dark: continuous border with smooth fading illuminated top highlight
        'group relative inline-flex select-none items-center justify-between',
        'rounded-[var(--fluent-radius-control)]',
        'bg-[var(--fluent-btn-bg)] text-[var(--fluent-btn-fg)]',
        'border border-[var(--fluent-btn-border)]',
        'shadow-[var(--fluent-shadow-control)]',
        'font-[var(--fluent-font)] font-normal text-[14px] leading-[20px] antialiased',
        'transition-all duration-[150ms] ease-[cubic-bezier(0,0,0,1)]',
        'outline-none cursor-pointer',
        // Hover: smooth fade without any abrupt border pop
        'hover:bg-[var(--fluent-btn-bg-hover)] hover:border-[var(--fluent-btn-border-hover)] hover:shadow-[var(--fluent-shadow-control-hover)]',
        // Focus ring: 2px ring + 2px offset
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fluent-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fluent-focus-offset)]',
        // Open & Active state
        'data-[state=open]:bg-[var(--fluent-btn-bg-hover)] data-[state=open]:border-[var(--fluent-btn-border-hover)]',
        'active:scale-[0.99] active:translate-y-[0.5px] active:shadow-none',
        // Disabled
        'disabled:pointer-events-none disabled:bg-[rgba(255,255,255,0.30)] disabled:border-[rgba(0,0,0,0.04)] disabled:text-[rgba(0,0,0,0.32)] disabled:shadow-none',
        'dark:disabled:bg-[rgba(255,255,255,0.03)] dark:disabled:border-[rgba(255,255,255,0.04)] dark:disabled:text-[rgba(255,255,255,0.30)]',
        // Size
        isIconOnly ? iconOnlySizeMap[size] : sizeMap[size],
        className,
      )}
      {...props}
    >
      {/* Leading icon (circle placeholder in spec, or any icon) */}
      {(triggerVariant === 'with-icon' || triggerVariant === 'icon-only') && leadingIcon && (
        <span className="pointer-events-none flex shrink-0 items-center text-[var(--neutral-muted)] group-hover:text-[var(--neutral-emphasis)] transition-colors">
          {leadingIcon}
        </span>
      )}

      {/* Text value */}
      {!isIconOnly && (
        <span className="flex-1 truncate text-left text-[var(--neutral-emphasis)]">
          {children}
        </span>
      )}

      {/* Chevron down with 120ms smooth rotation & dark crisp stroke */}
      <ChevronDown
        className={cn(
          'shrink-0 text-[#424242] dark:text-[#d0d0d0] stroke-[2] transition-transform duration-[120ms] ease-[cubic-bezier(0,0,0,1)]',
          'group-data-[state=open]:rotate-180',
          isIconOnly ? 'size-3.5' : 'size-4',
        )}
        aria-hidden="true"
      />
    </SelectPrimitive.Trigger>
  )
}

// ─── Portal / Overlay ─────────────────────────────────────────────────────────

function SelectPortal(props: React.ComponentProps<typeof SelectPrimitive.Portal>) {
  return <SelectPrimitive.Portal data-slot="select-portal" {...props} />
}

// ─── Content (flyout panel) ───────────────────────────────────────────────────

function SelectContent({
  className,
  children,
  position = 'popper',
  align    = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPortal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          // Flyout surface — elevated, acrylic-inspired
          'surface-flyout',
          'relative z-50',
          'min-w-[var(--radix-select-trigger-width)] max-h-80',
          'overflow-x-hidden overflow-y-auto',
          'rounded-[var(--fluent-radius-flyout)]',
          'p-1',
          'shadow-[var(--fluent-shadow-flyout)]',
          // Animation (Fluent: Direct Entrance — Fast In)
          'origin-[var(--radix-select-content-transform-origin)]',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[state=open]:duration-[120ms] data-[state=closed]:duration-[100ms]',
          // Popper positioning
          position === 'popper' && [
            'data-[side=bottom]:translate-y-1',
            'data-[side=top]:-translate-y-1',
            'data-[side=left]:-translate-x-1',
            'data-[side=right]:translate-x-1',
          ],
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-0.5 space-y-0.5',
            position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPortal>
  )
}

// ─── Label ────────────────────────────────────────────────────────────────────

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--neutral-muted)] select-none',
        className,
      )}
      {...props}
    />
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center',
        'rounded-[var(--fluent-radius-control)]',
        'h-8 pl-3 pr-8',
        'text-[14px] leading-[20px]',
        'font-[var(--fluent-font)] antialiased',
        'text-[var(--neutral-emphasis)]',
        'outline-none',
        'transition-colors duration-[83ms]',
        // Hover / focus
        'hover:bg-[var(--fluent-item-hover)] focus:bg-[var(--fluent-item-hover)]',
        'data-[highlighted]:bg-[var(--fluent-item-hover)] data-[highlighted]:text-[var(--neutral-emphasis)]',
        // Disabled
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
        className,
      )}
      {...props}
    >
      {/* Check indicator */}
      <span className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center text-[var(--fluent-accent)]">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5 stroke-[2.5]" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'pointer-events-none -mx-1 my-1 h-px bg-[var(--fluent-border-subtle)]',
        className,
      )}
      {...props}
    />
  )
}

// ─── Scroll buttons ───────────────────────────────────────────────────────────

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-[var(--neutral-muted)]',
        className,
      )}
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down"
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-[var(--neutral-muted)]',
        className,
      )}
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectPortal,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

