/**
 * Pill / Tag / Chip — Atom A-07
 * Fluent Design 2 · Pill & Badge spec
 *
 * References: Image 3 & Image 4 (Subtle, Accent, With Icon, With Avatar across Rest, Hover, Pressed, Disabled, Focus)
 * Fully accessible pill with support for leading icon, user avatar, dismiss action, and interactive press states.
 */
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const pillVariants = cva(
  [
    'inline-flex shrink-0 select-none items-center justify-center',
    'rounded-full', // Pill: 9999px fully rounded capsules
    'font-[\'Segoe_UI_Variable\',_\'Segoe_UI\',_system-ui,_-apple-system,_sans-serif]',
    'font-medium whitespace-nowrap antialiased',
    'transition-all duration-[120ms] ease-[cubic-bezier(0,0,0,1)]',
    'outline-none',
    // Focus ring: 2px ring + 2px offset (Fluent 2 spec)
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fluent-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fluent-focus-offset)]',
  ].join(' '),
  {
    variants: {
      variant: {
        /**
         * Subtle / Standard Pill (Image 4 Rows 1 & 2)
         * Light: Soft translucent grey fill `rgba(0,0,0,0.05)`, dark text
         * Dark:  Translucent white fill `rgba(255,255,255,0.08)`, white text
         */
        subtle: [
          'bg-[rgba(0,0,0,0.05)] text-[var(--fluent-btn-fg)] border border-transparent',
          'hover:bg-[rgba(0,0,0,0.08)]',
          'active:bg-[rgba(0,0,0,0.12)] active:scale-[0.98]',
          'dark:bg-[rgba(255,255,255,0.08)] dark:text-white',
          'dark:hover:bg-[rgba(255,255,255,0.12)]',
          'dark:active:bg-[rgba(255,255,255,0.16)]',
        ].join(' '),

        /**
         * Accent Pill (Image 4 Rows 3 & 4)
         * Light: Fluent cobalt blue #0067c0 with crisp white text
         * Dark:  Fluent cyan-blue #60cdff with high-contrast deep navy text #002747
         */
        accent: [
          'bg-[var(--fluent-accent)] text-white border border-transparent',
          'hover:bg-[var(--fluent-accent-hover)]',
          'active:bg-[var(--fluent-accent-pressed)] active:scale-[0.98]',
          'dark:text-[#002747]',
        ].join(' '),

        /**
         * Outline Pill
         * 1px subtle stroke for secondary or filter chips
         */
        outline: [
          'bg-transparent text-[var(--fluent-btn-fg)] border border-[var(--fluent-btn-border)]',
          'hover:bg-[var(--fluent-item-hover)] hover:border-[var(--fluent-btn-border-hover)]',
          'active:bg-[var(--fluent-item-pressed)] active:scale-[0.98]',
        ].join(' '),
      },

      size: {
        sm: 'h-6 px-2 text-[12px] leading-[16px] gap-1.5 [&_svg:not([class*="size-"])]:size-3',
        md: 'h-7 px-2.5 text-[13px] leading-[18px] gap-1.5 [&_svg:not([class*="size-"])]:size-3.5',
        lg: 'h-8 px-3 text-[14px] leading-[20px] gap-2 [&_svg:not([class*="size-"])]:size-4',
      },

      disabled: {
        true: 'pointer-events-none opacity-40 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },

    defaultVariants: {
      variant: 'subtle',
      size: 'md',
      disabled: false,
    },
  }
)

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {
  leadingIcon?: React.ReactNode
  avatar?: React.ReactNode
  onDismiss?: (e: React.MouseEvent) => void
  interactive?: boolean
  disabled?: boolean
  asButton?: boolean
}

export const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  (
    {
      className,
      variant,
      size,
      disabled = false,
      leadingIcon,
      avatar,
      onDismiss,
      interactive = true,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // If not interactive and no onClick, strip hover pointer
    const isInteractive = interactive && !disabled

    return (
      <div
        ref={ref}
        role={onClick || isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={disabled ? undefined : onClick}
        className={cn(
          pillVariants({ variant, size, disabled }),
          !isInteractive && 'cursor-default pointer-events-none hover:bg-[inherit]',
          avatar && 'pl-1', // Tighter left padding when leading with circular avatar
          className
        )}
        {...props}
      >
        {/* Leading Avatar (Images 4 rows 5 & 6) */}
        {avatar && (
          <span className="shrink-0 overflow-hidden rounded-full size-5 flex items-center justify-center">
            {typeof avatar === 'string' ? (
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              avatar
            )}
          </span>
        )}

        {/* Leading Icon (Image 3 top-right) */}
        {leadingIcon && !avatar && (
          <span className="shrink-0 flex items-center justify-center text-current opacity-80">
            {leadingIcon}
          </span>
        )}

        {/* Content text */}
        <span>{children}</span>

        {/* Trailing Dismiss Action (optional) */}
        {onDismiss && (
          <button
            type="button"
            aria-label="Remove"
            onClick={(e) => {
              e.stopPropagation()
              if (!disabled) onDismiss(e)
            }}
            className={cn(
              '-mr-1 flex size-4 items-center justify-center rounded-full opacity-70 transition-opacity',
              'hover:opacity-100 hover:bg-[rgba(0,0,0,0.10)] dark:hover:bg-[rgba(255,255,255,0.15)]',
              'focus:outline-none'
            )}
          >
            <X className="size-3 stroke-[2.5]" />
          </button>
        )}
      </div>
    )
  }
)
Pill.displayName = 'Pill'

