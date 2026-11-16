/**
 * Surface — Atom A-02
 * Fluent Design 2 · Layering & Elevation
 *
 * Surface types from STYLE_GUIDE + images:
 *
 *   card        – Elevation  8  · Contour 1 · Opaque · Slight shadow
 *   flyout      – Elevation 32  · Contour 1 · Background Acrylic (blur)
 *   dialog      – Elevation 128 · Contour 1 · Opaque · Largest shadow
 *   shell       – Mica (opaque, background tint, same as app base layer)
 *   thin-acrylic– Thin Acrylic (most translucent, lightest shadow)
 *
 * Both light and dark modes are supported.
 */
import React from 'react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SurfaceVariant =
  | 'card'
  | 'flyout'
  | 'dialog'
  | 'shell'
  | 'thin-acrylic'
  | 'base'

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fluent surface / material type */
  variant?: SurfaceVariant
  /** Additional border radius override (defaults to 'md' = 8px per Fluent specification) */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill'
  as?: React.ElementType
}

// ─── Radius map ───────────────────────────────────────────────────────────────

const radiusMap = {
  none: 'rounded-none',
  sm:   'rounded-[4px]',   // in-page elements / buttons
  md:   'rounded-[8px]',   // top-level containers, flyouts, dialogs, cards
  lg:   'rounded-[12px]',
  xl:   'rounded-[16px]',
  '2xl':'rounded-[20px]',
  pill: 'rounded-full',
} as const

// ─── Surface variant classes ──────────────────────────────────────────────────
// Each maps to a CSS class defined in index.css for clean separation.
// Light/dark handled via CSS variables and @media/dark class.

const variantClass: Record<SurfaceVariant, string> = {
  /**
   * base  – The app canvas (Mica: opaque, background-tinted).
   *         Used as the foundational app background layer.
   */
  base: 'surface-base',

  /**
   * shell – In-page navigation/sidebar shell surface.
   *         Slightly elevated from base, opaque.
   */
  shell: 'surface-shell',

  /**
   * card  – Elevation 8. Content layer cards.
   *         Opaque, 1px contour, soft box-shadow.
   */
  card: 'surface-card',

  /**
   * flyout – Elevation 32. Context menus, dropdowns, non-modal popups.
   *          Background acrylic: translucent + blur + noise.
   */
  flyout: 'surface-flyout',

  /**
   * dialog – Elevation 128. Modal dialogs.
   *          Opaque, strong shadow, smoke overlay behind (handled by overlay).
   */
  dialog: 'surface-dialog',

  /**
   * thin-acrylic – Most translucent acrylic variant.
   *                Used for lightweight overlapping panels.
   */
  'thin-acrylic': 'surface-thin-acrylic',
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  (
    {
      variant = 'card',
      radius  = 'md',
      as,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = (as ?? 'div') as React.ElementType

    return (
      <Tag
        ref={ref}
        data-slot="surface"
        data-variant={variant}
        className={cn(
          variantClass[variant],
          radiusMap[radius],
          'transition-colors duration-[167ms] ease-[cubic-bezier(0,0,0,1)]',
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  },
)

Surface.displayName = 'Surface'
