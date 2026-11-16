/**
 * Text — Atom A-01
 * Fluent Design 2 · Segoe UI Variable type ramp
 *
 * Maps the full type ramp from STYLE_GUIDE.md:
 *   Caption     12/16 epx – Regular
 *   Body        14/20 epx – Regular
 *   Body Strong 14/20 epx – Semibold
 *   Subtitle    18/24 epx – Regular | Semibold
 *   Title       20/28 epx – Semibold
 *   Title Large 28/36 epx – Semibold
 *   Display     40/52 epx – Semibold
 *   Hero        68/92 epx – Semibold
 */
import React from 'react'
import { cn } from '@/lib/utils'

// ─── Variant maps ────────────────────────────────────────────────────────────

const sizeMap = {
  caption:        'text-[12px] leading-[16px]',
  body:           'text-[14px] leading-[20px]',
  'body-strong':  'text-[14px] leading-[20px]',
  subtitle:       'text-[18px] leading-[24px]',
  title:          'text-[20px] leading-[28px]',
  'title-large':  'text-[28px] leading-[36px]',
  display:        'text-[40px] leading-[52px]',
  hero:           'text-[68px] leading-[92px]',
} as const

const weightMap = {
  regular:  'font-normal',
  semibold: 'font-semibold',
  bold:     'font-bold',
} as const

// Size → implied default weight (Fluent spec)
const defaultWeightForVariant: Record<TextVariant, TextWeight> = {
  caption:        'regular',
  body:           'regular',
  'body-strong':  'semibold',
  subtitle:       'regular',
  title:          'semibold',
  'title-large':  'semibold',
  display:        'semibold',
  hero:           'semibold',
}

const colorMap = {
  emphasis:    'text-[var(--neutral-emphasis)]',
  body:        'text-[var(--neutral-body)]',
  muted:       'text-[var(--neutral-muted)]',
  placeholder: 'text-[var(--neutral-placeholder)]',
  brand:       'text-[var(--neutral-brand)]',
  inverse:     'text-white',
  inherit:     'text-inherit',
} as const

// ─── Types ────────────────────────────────────────────────────────────────────

type TextVariant = keyof typeof sizeMap
type TextWeight  = keyof typeof weightMap
type TextColor   = keyof typeof colorMap

// Which HTML element each variant maps to by default (semantic)
const defaultElementMap: Record<TextVariant, React.ElementType> = {
  caption:        'span',
  body:           'p',
  'body-strong':  'p',
  subtitle:       'h3',
  title:          'h2',
  'title-large':  'h1',
  display:        'h1',
  hero:           'h1',
}

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Fluent type ramp variant */
  variant?: TextVariant
  /** Override the font weight (defaults to variant's natural weight) */
  weight?: TextWeight
  /** Semantic colour alias */
  color?: TextColor
  /** Render as a different HTML tag */
  as?: React.ElementType
  /** Truncate with ellipsis when text overflows */
  truncate?: boolean
  /** Clamp to N lines */
  clamp?: 1 | 2 | 3 | 4
}

const clampMap: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
}

// ─── Tracking map (tightened on display, relaxed on caption for optimal legibility)
const trackingMap = {
  caption:        'tracking-[0.005em]',
  body:           'tracking-normal',
  'body-strong':  'tracking-normal',
  subtitle:       'tracking-[-0.005em]',
  title:          'tracking-[-0.01em]',
  'title-large':  'tracking-[-0.015em]',
  display:        'tracking-[-0.02em]',
  hero:           'tracking-[-0.025em]',
} as const

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      variant  = 'body',
      weight,
      color    = 'body',
      as,
      truncate = false,
      clamp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedWeight = weight ?? defaultWeightForVariant[variant]
    const Tag = (as ?? defaultElementMap[variant]) as React.ElementType

    return (
      <Tag
        ref={ref}
        data-slot="text"
        data-variant={variant}
        className={cn(
          // Font family — Fluent font token with system fallback & subpixel antialiasing
          'font-[var(--fluent-font)] antialiased',
          sizeMap[variant],
          weightMap[resolvedWeight],
          trackingMap[variant],
          colorMap[color],
          truncate && 'truncate',
          clamp && clampMap[clamp],
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  },
)

Text.displayName = 'Text'

// ─── Convenience exports (optional shorthands) ────────────────────────────────

export const Caption     = (p: Omit<TextProps, 'variant'>) => <Text variant="caption"     {...p} />
export const Body        = (p: Omit<TextProps, 'variant'>) => <Text variant="body"        {...p} />
export const BodyStrong  = (p: Omit<TextProps, 'variant'>) => <Text variant="body-strong" {...p} />
export const Subtitle    = (p: Omit<TextProps, 'variant'>) => <Text variant="subtitle"    {...p} />
export const Title       = (p: Omit<TextProps, 'variant'>) => <Text variant="title"       {...p} />
export const TitleLarge  = (p: Omit<TextProps, 'variant'>) => <Text variant="title-large" {...p} />
export const Display     = (p: Omit<TextProps, 'variant'>) => <Text variant="display"     {...p} />
