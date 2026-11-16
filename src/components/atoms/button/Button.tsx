/**
 * Button — Atom A-04 (upgraded)
 * Fluent Design 2 · Button spec
 *
 * Variants from image reference:
 *   accent   – Blue filled (--fluent-accent). Rest/Hover/Pressed/Disabled/Focus.
 *   standard – White/outlined. Rest/Hover/Pressed/Disabled/Focus.
 *   ghost    – No background. Hover reveals subtle fill.
 *   subtle   – Minimal; for de-emphasized actions.
 *   link     – Text-only with underline on hover.
 *   destructive – Red semantic for destructive actions.
 *
 * All variants respect light + dark mode via CSS custom properties.
 * Icon-only size is available. Loading state uses a spinner.
 * Focus ring follows Fluent spec: solid 2px border offset.
 */
import React from 'react'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ─── CVA ─────────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    // Base: shared across ALL variants
    'relative inline-flex shrink-0 select-none items-center justify-center',
    'rounded-[var(--fluent-radius-control)]', // 4px — in-page elements
    'border border-transparent',
    'font-[\'Segoe_UI_Variable\',_\'Segoe_UI\',_system-ui,_-apple-system,_sans-serif]',
    'font-medium text-[14px] leading-[20px]',
    'whitespace-nowrap',
    'transition-all duration-[120ms] ease-[cubic-bezier(0,0,0,1)]',
    'outline-none cursor-pointer',
    // Focus ring: 2px ring + 2px offset (Fluent 2 specification)
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fluent-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fluent-focus-offset)]',
    // Active micro-press
    'active:scale-[0.985] active:translate-y-[0.5px]',
    // Disabled baseline
    'disabled:pointer-events-none disabled:cursor-not-allowed',
    // Icon children handling
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        /**
         * Accent (Primary)
         * Light: Cobalt #0067c0 with smooth elevation shadow and white text
         * Dark:  Cyan-blue #60cdff with high-contrast deep navy text #002747
         * Seamless fading borders: no abrupt bottom border cuts on rest or hover.
         */
        accent: [
          'bg-[var(--fluent-accent)] text-[var(--fluent-accent-fg)]',
          'border border-transparent',
          'shadow-[0_1px_2px_0_rgba(0,0,0,0.12),inset_0_-1px_0_0_rgba(0,0,0,0.22)]',
          'dark:shadow-[0_1px_2px_0_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.28)]',
          // Hover: smooth background shift, no weird bottom border added
          'hover:bg-[var(--fluent-accent-hover)] hover:border-transparent',
          'hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.16),inset_0_-1px_0_0_rgba(0,0,0,0.26)]',
          'dark:hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.30),inset_0_1px_0_0_rgba(255,255,255,0.34)]',
          // Pressed
          'active:bg-[var(--fluent-accent-pressed)] active:shadow-none active:scale-[0.99] active:translate-y-[0.5px]',
          // Disabled
          'disabled:bg-[rgba(0,0,0,0.20)] disabled:border-transparent disabled:text-white/60 disabled:shadow-none',
          'dark:disabled:bg-[rgba(255,255,255,0.12)] dark:disabled:text-white/40',
        ].join(' '),

        /**
         * Standard
         * Light: Clean surface with uniform border and subtle fading bottom lip shadow
         * Dark:  Translucent layer with uniform border and illuminated top highlight shadow
         * Continuous 1px perimeter: curves smoothly around corners without diagonal cuts.
         */
        standard: [
          'bg-[var(--fluent-btn-bg)] text-[var(--fluent-btn-fg)]',
          'border border-[var(--fluent-btn-border)]',
          'shadow-[var(--fluent-shadow-control)]',
          // Hover: continuous uniform border shift with matching elevation — zero bottom-border pop
          'hover:bg-[var(--fluent-btn-bg-hover)] hover:border-[var(--fluent-btn-border-hover)] hover:shadow-[var(--fluent-shadow-control-hover)]',
          // Pressed
          'active:bg-[var(--fluent-btn-bg-pressed)] active:border-[var(--fluent-btn-border-pressed)] active:shadow-none active:scale-[0.99] active:translate-y-[0.5px]',
          // Disabled
          'disabled:bg-[rgba(255,255,255,0.30)] disabled:border-[rgba(0,0,0,0.04)] disabled:text-[rgba(0,0,0,0.32)] disabled:shadow-none',
          'dark:disabled:bg-[rgba(255,255,255,0.03)] dark:disabled:border-[rgba(255,255,255,0.04)] dark:disabled:text-[rgba(255,255,255,0.30)]',
        ].join(' '),

        /**
         * Ghost — transparent at rest, subtle highlight on hover (strictly border-free)
         */
        ghost: [
          'bg-transparent text-[var(--fluent-btn-fg)] border border-transparent shadow-none',
          'hover:bg-[var(--fluent-item-hover)] hover:border-transparent hover:shadow-none',
          'active:bg-[var(--fluent-item-pressed)] active:border-transparent active:shadow-none',
          'disabled:opacity-35 disabled:border-transparent disabled:shadow-none',
        ].join(' '),

        /**
         * Subtle — de-emphasised, muted text at rest (strictly border-free)
         */
        subtle: [
          'bg-transparent text-[var(--neutral-muted)] border border-transparent shadow-none',
          'hover:bg-[var(--fluent-item-hover)] hover:text-[var(--neutral-emphasis)] hover:border-transparent hover:shadow-none',
          'active:bg-[var(--fluent-item-pressed)] active:border-transparent active:shadow-none',
          'disabled:opacity-35 disabled:border-transparent disabled:shadow-none',
        ].join(' '),

        /**
         * Destructive — semantic red
         */
        destructive: [
          'bg-[var(--fluent-destructive)] text-white border border-transparent shadow-[var(--fluent-shadow-control)]',
          'hover:bg-[var(--fluent-destructive-hover)] hover:border-transparent',
          'active:bg-[var(--fluent-destructive-pressed)] active:border-transparent active:shadow-none',
          'disabled:opacity-40 disabled:border-transparent disabled:shadow-none',
        ].join(' '),

        /**
         * Link — underline on hover
         */
        link: [
          'bg-transparent border border-transparent shadow-none text-[var(--fluent-accent)] underline-offset-4',
          'hover:underline hover:border-transparent hover:shadow-none',
          'active:opacity-75 active:border-transparent active:shadow-none',
          'disabled:opacity-35 disabled:border-transparent disabled:shadow-none',
        ].join(' '),
      },

      size: {
        xs:   'h-6  px-2   text-[12px] leading-[16px] gap-1    [&_svg:not([class*="size-"])]:size-3',
        sm:   'h-7  px-2.5 text-[12px] leading-[16px] gap-1.5  [&_svg:not([class*="size-"])]:size-3.5',
        md:   'h-8  px-3   text-[14px] leading-[20px] gap-2    [&_svg:not([class*="size-"])]:size-4',
        lg:   'h-9  px-4   text-[14px] leading-[20px] gap-2    [&_svg:not([class*="size-"])]:size-4',
        xl:   'h-10 px-5   text-[15px] leading-[22px] gap-2.5  [&_svg:not([class*="size-"])]:size-4.5',
        // Icon-only: perfectly square
        'icon-xs': 'size-6  p-0 [&_svg:not([class*="size-"])]:size-3',
        'icon-sm': 'size-7  p-0 [&_svg:not([class*="size-"])]:size-3.5',
        'icon-md': 'size-8  p-0 [&_svg:not([class*="size-"])]:size-4',
        'icon-lg': 'size-9  p-0 [&_svg:not([class*="size-"])]:size-4',
        'icon-xl': 'size-10 p-0 [&_svg:not([class*="size-"])]:size-4.5',
      },
    },

    defaultVariants: {
      variant: 'standard',
      size:    'md',
    },
  },
)

// ─── Spinner (inline) ─────────────────────────────────────────────────────────

const Spinner = () => (
  <svg
    className="size-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="3"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /** Render as child component (Radix Slot) */
  asChild?: boolean
  /** Show loading spinner and block interaction */
  loading?: boolean
  /** Label for loading state (defaults to children) */
  loadingLabel?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = 'standard',
      size     = 'md',
      asChild  = false,
      loading  = false,
      loadingLabel,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : 'button'

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading && <Spinner />}
        {loading && loadingLabel ? loadingLabel : children}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { buttonVariants }

