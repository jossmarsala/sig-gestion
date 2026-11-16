/**
 * Design System Sandbox — dev-only
 *
 * Route: /design-system (available only when import.meta.env.DEV === true)
 *
 * Replicas of the reference images provided in the style guide:
 *   1. Text & Interactive item states (Rest, Hover, Pressed, Disabled, Focus)
 *   2. Surfaces (Card, Flyout, Dialog, Shell, Thin Acrylic) in Light & Dark
 *   3. Buttons matrix (Accent & Standard in Rest, Hover, Pressed, Disabled, Focus)
 *   4. Dropdown variants (Text only, With leading icon, Icon only)
 */
import React, { useState } from 'react'
import { Sun, Moon, Circle, Check, Calendar, Search, User } from 'lucide-react'

// ── Atoms ────────────────────────────────────────────────────────────────────
import {
  Caption, Body, BodyStrong, Subtitle, Title, TitleLarge, Display,
} from '@/components/atoms/text'
import { Button } from '@/components/atoms/button'
import { Surface } from '@/components/atoms/surface'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/atoms/select'
import { Checkbox, CheckboxField } from '@/components/atoms/checkbox'
import { RadioGroup, RadioGroupItem, RadioGroupField } from '@/components/atoms/radio'
import { Pill } from '@/components/atoms/pill'
import { Input, InputField } from '@/components/atoms/input'

// ─── Section Header ──────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="space-y-4">
    <div>
      <div className="flex items-center gap-3">
        <BodyStrong color="emphasis" className="whitespace-nowrap text-base">{title}</BodyStrong>
        <div className="h-px flex-1 bg-[var(--fluent-border-subtle)]" />
      </div>
      {subtitle && <Caption color="muted" className="mt-1 block">{subtitle}</Caption>}
    </div>
    {children}
  </section>
)

// ─── 1. Image 1: Interactive Text / List Item States ─────────────────────────

const InteractiveItemStates = () => {
  return (
    <div className="space-y-6">
      {/* Light Strip */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode
        </Caption>
        <div className="grid grid-cols-5 gap-4 text-center">
          <Caption color="muted" className="font-semibold">Rest</Caption>
          <Caption color="muted" className="font-semibold">Hover</Caption>
          <Caption color="muted" className="font-semibold">Pressed</Caption>
          <Caption color="muted" className="font-semibold">Disabled</Caption>
          <Caption color="muted" className="font-semibold">Focus</Caption>

          {/* Row: Interactive Items */}
          <div className="flex h-10 items-center justify-center">
            <span className="text-[14px] text-[var(--neutral-emphasis)]">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center rounded-[var(--fluent-radius-control)] bg-[rgba(0,0,0,0.04)]">
            <span className="text-[14px] text-[var(--neutral-emphasis)]">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center rounded-[var(--fluent-radius-control)] bg-[rgba(0,0,0,0.07)]">
            <span className="text-[14px] text-[var(--neutral-emphasis)]">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center">
            <span className="text-[14px] text-[var(--neutral-muted)] opacity-50">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center rounded-[var(--fluent-radius-control)] border-2 border-black bg-transparent">
            <span className="text-[14px] text-[var(--neutral-emphasis)]">Text</span>
          </div>
        </div>
      </div>

      {/* Dark Strip */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 shadow-sm">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode
        </Caption>
        <div className="grid grid-cols-5 gap-4 text-center">
          <Caption color="muted" className="font-semibold">Rest</Caption>
          <Caption color="muted" className="font-semibold">Hover</Caption>
          <Caption color="muted" className="font-semibold">Pressed</Caption>
          <Caption color="muted" className="font-semibold">Disabled</Caption>
          <Caption color="muted" className="font-semibold">Focus</Caption>

          {/* Row: Interactive Items */}
          <div className="flex h-10 items-center justify-center">
            <span className="text-[14px] text-white">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center rounded-[var(--fluent-radius-control)] bg-[rgba(255,255,255,0.08)]">
            <span className="text-[14px] text-white">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center rounded-[var(--fluent-radius-control)] bg-[rgba(255,255,255,0.14)]">
            <span className="text-[14px] text-white">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center">
            <span className="text-[14px] text-white/30">Text</span>
          </div>
          <div className="flex h-10 items-center justify-center rounded-[var(--fluent-radius-control)] border-2 border-white bg-transparent">
            <span className="text-[14px] text-white">Text</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 2. Images 2 & 3: Surfaces & Materials ───────────────────────────────────

const SurfaceShowcase = () => {
  const surfaces = [
    { variant: 'card' as const, label: 'Card Surface', elevation: 'Elevation 8 · 1px contour · Opaque content cards' },
    { variant: 'flyout' as const, label: 'Flyout Surface', elevation: 'Elevation 32 · 1px contour · Background Acrylic (blur + saturate)' },
    { variant: 'dialog' as const, label: 'Dialog Surface', elevation: 'Elevation 128 · 1px contour · Modal overlays' },
    { variant: 'shell' as const, label: 'Shell Surface', elevation: 'Mica · Opaque background-tinted navigation foundation' },
    { variant: 'thin-acrylic' as const, label: 'Thin Acrylic Surface', elevation: 'Translucent acrylic · Lightweight supporting panels' },
  ]

  return (
    <div className="space-y-6">
      {/* Light Surfaces Container */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#f5f5f5] p-6 space-y-4">
        <Caption color="muted" className="block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode Surfaces (Base: #f5f5f5)
        </Caption>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {surfaces.map((s) => (
            <div key={s.variant} className="flex flex-col justify-between rounded-lg bg-[#ffffff] p-4 border border-[rgba(0,0,0,0.06)] shadow-2xs">
              <div className="mb-3">
                <BodyStrong color="emphasis">{s.label}</BodyStrong>
                <Caption color="muted" className="text-[11px] mt-0.5 block">{s.elevation}</Caption>
              </div>
              <Surface variant={s.variant} radius="md" className="h-20 w-full flex items-center justify-center">
                <Caption color="muted" className="text-[11px]">Preview</Caption>
              </Surface>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Surfaces Container */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#181818] p-6 space-y-4">
        <Caption color="muted" className="block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode Surfaces (Base: #181818)
        </Caption>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {surfaces.map((s) => (
            <div key={s.variant} className="flex flex-col justify-between rounded-lg bg-[#242424] p-4 border border-[rgba(255,255,255,0.06)] shadow-2xs">
              <div className="mb-3">
                <BodyStrong color="emphasis" className="text-white">{s.label}</BodyStrong>
                <Caption color="muted" className="text-[11px] mt-0.5 block">{s.elevation}</Caption>
              </div>
              <Surface variant={s.variant} radius="md" className="h-20 w-full flex items-center justify-center">
                <Caption color="muted" className="text-[11px]">Preview</Caption>
              </Surface>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 3. Image 4: Button Matrix ───────────────────────────────────────────────

const ButtonMatrix = () => {
  return (
    <div className="space-y-6">
      {/* Light Mode Matrix */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode Buttons
        </Caption>

        {/* Header */}
        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[var(--fluent-border-subtle)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">Variant</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Accent Row (Light) */}
        <div className="grid grid-cols-6 gap-3 py-4 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div>
            <span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">
              Accent
            </span>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24 bg-[var(--fluent-accent-hover)] border-transparent shadow-[0_1px_2px_0_rgba(0,0,0,0.16),inset_0_-1px_0_0_rgba(0,0,0,0.26)]">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24 bg-[var(--fluent-accent-pressed)] border-transparent shadow-none translate-y-px">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" disabled className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24 ring-2 ring-black ring-offset-2 ring-offset-white">Text</Button>
          </div>
        </div>

        {/* Standard Row (Light) */}
        <div className="grid grid-cols-6 gap-3 py-4 items-center min-w-[540px]">
          <div>
            <span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">
              Standard
            </span>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24 bg-[var(--fluent-btn-bg-hover)] border-[var(--fluent-btn-border-hover)] shadow-[var(--fluent-shadow-control-hover)]">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24 bg-[var(--fluent-btn-bg-pressed)] border-[var(--fluent-btn-border-pressed)] shadow-none translate-y-px">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" disabled className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24 ring-2 ring-black ring-offset-2 ring-offset-white">Text</Button>
          </div>
        </div>
      </div>

      {/* Dark Mode Matrix */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode Buttons
        </Caption>

        {/* Header */}
        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">Variant</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Accent Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-4 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div>
            <span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">
              Accent
            </span>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24 bg-[var(--fluent-accent-hover)] border-transparent shadow-[0_1px_2px_0_rgba(0,0,0,0.30),inset_0_1px_0_0_rgba(255,255,255,0.34)]">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24 bg-[var(--fluent-accent-pressed)] border-transparent shadow-none translate-y-px">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" disabled className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="accent" size="md" className="w-24 ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]">Text</Button>
          </div>
        </div>

        {/* Standard Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-4 items-center min-w-[540px]">
          <div>
            <span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">
              Standard
            </span>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24 bg-[var(--fluent-btn-bg-hover)] border-[var(--fluent-btn-border-hover)] shadow-[var(--fluent-shadow-control-hover)]">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24 bg-[var(--fluent-btn-bg-pressed)] border-[var(--fluent-btn-border-pressed)] shadow-none translate-y-px">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" disabled className="w-24">Text</Button>
          </div>
          <div className="flex justify-center">
            <Button variant="standard" size="md" className="w-24 ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]">Text</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 4. Image 5: Dropdown Variants (Interactive + Static Open Previews) ───────

const DropdownShowcase = () => {
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [val3, setVal3] = useState('')

  const dummyItems = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4']

  return (
    <div className="space-y-6">
      {/* Detailed Close-Up Inspector: Light & Dark Mode Tactile Borders */}
      <div id="cad-inspection" className="space-y-6">
        {/* Light Mode Close-Up: Subtle darker bottom border */}
        <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm">
          <div className="mb-4">
            <Caption color="muted" className="font-semibold uppercase tracking-wider text-[11px] block">
              Light Mode Close-Up: Fading Border Lip (Continuous Stroke + Smooth Inset Elevation)
            </Caption>
            <Body color="body" className="text-xs text-[var(--neutral-muted)] mt-0.5">
              Continuous uniform 1px perimeter contour with gentle fading bottom lip elevation. No abrupt corner seams, no 45° cuts, and zero bottom-border pop on hover.
            </Body>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 rounded-lg border border-[rgba(0,0,0,0.06)] bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] p-8">
            <div className="space-y-2 text-center">
              <Caption color="muted" className="text-[11px]">1x Native Size</Caption>
              <div className="flex items-center gap-3">
                <Button variant="standard" size="md">Button</Button>
                <div className="w-48">
                  <Select>
                    <SelectTrigger size="md" className="w-full">
                      <SelectValue placeholder="Text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dummyItems.map(item => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <Caption color="muted" className="text-[11px]">2x Magnified Inspection</Caption>
              <div className="scale-125 transform-gpu origin-center flex items-center gap-3">
                <Button variant="standard" size="md">Button</Button>
                <div className="w-48">
                  <Select>
                    <SelectTrigger size="md" className="w-full">
                      <SelectValue placeholder="Text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dummyItems.map(item => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode Close-Up: Reference image replica (Top border is illuminated highlight, rest stays normal) */}
        <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 shadow-sm">
          <div className="mb-4">
            <Caption color="muted" className="font-semibold uppercase tracking-wider text-[11px] block">
              Dark Mode Close-Up: Illuminated Top Highlight (Reference Replica)
            </Caption>
            <Body color="body" className="text-xs text-white/60 mt-0.5">
              Illuminated top highlight softly curves around corners and fades into the sides without seams or diagonal breaks.
            </Body>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#141414] bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:12px_12px] p-8">
            <div className="space-y-2 text-center">
              <Caption color="muted" className="text-[11px]">1x Native Size</Caption>
              <div className="flex items-center gap-3">
                <Button variant="standard" size="md">Button</Button>
                <div className="w-48">
                  <Select>
                    <SelectTrigger
                      triggerVariant="with-icon"
                      leadingIcon={<Circle className="size-4 stroke-[1.75]" />}
                      size="md"
                      className="w-full"
                    >
                      <SelectValue placeholder="Text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dummyItems.map(item => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <Caption color="muted" className="text-[11px]">2x Magnified Inspection</Caption>
              <div className="scale-125 transform-gpu origin-center flex items-center gap-3">
                <Button variant="standard" size="md">Button</Button>
                <div className="w-48">
                  <Select>
                    <SelectTrigger
                      triggerVariant="with-icon"
                      leadingIcon={<Circle className="size-4 stroke-[1.75]" />}
                      size="md"
                      className="w-full"
                    >
                      <SelectValue placeholder="Text" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dummyItems.map(item => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light Mode Dropdowns Showcase (matching Image 5) */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 space-y-6 shadow-sm">
        <Caption color="muted" className="block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode (Image 5 Reference Layout)
        </Caption>

        {/* 3 Columns matching image 5 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Default Text + Chevron */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-40">
              <Select value={val1} onValueChange={setVal1}>
                <SelectTrigger triggerVariant="default" size="md" className="w-full">
                  <SelectValue placeholder="Text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dummyItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Static Expanded Flyout Preview */}
            <div className="surface-flyout w-full rounded-[var(--fluent-radius-flyout)] p-2 space-y-1">
              {dummyItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-1.5 text-[14px] text-[var(--neutral-emphasis)] rounded-[var(--fluent-radius-control)] hover:bg-[var(--fluent-item-hover)]">
                  <span>{item}</span>
                  {idx === 0 && <Check className="size-4 text-[var(--fluent-accent)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: With leading icon */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-44">
              <Select value={val2} onValueChange={setVal2}>
                <SelectTrigger
                  triggerVariant="with-icon"
                  leadingIcon={<Circle className="size-4" />}
                  size="md"
                  className="w-full"
                >
                  <SelectValue placeholder="Text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dummyItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Static Expanded Flyout Preview */}
            <div className="surface-flyout w-full rounded-[var(--fluent-radius-flyout)] p-2 space-y-1">
              {dummyItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-1.5 text-[14px] text-[var(--neutral-emphasis)] rounded-[var(--fluent-radius-control)] hover:bg-[var(--fluent-item-hover)]">
                  <span>{item}</span>
                  {idx === 1 && <Check className="size-4 text-[var(--fluent-accent)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Icon only */}
          <div className="flex flex-col items-center space-y-3">
            <div>
              <Select value={val3} onValueChange={setVal3}>
                <SelectTrigger
                  triggerVariant="icon-only"
                  leadingIcon={<Circle className="size-4" />}
                  size="md"
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dummyItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Static Expanded Flyout Preview */}
            <div className="surface-flyout w-full rounded-[var(--fluent-radius-flyout)] p-2 space-y-1">
              {dummyItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-1.5 text-[14px] text-[var(--neutral-emphasis)] rounded-[var(--fluent-radius-control)] hover:bg-[var(--fluent-item-hover)]">
                  <span>{item}</span>
                  {idx === 2 && <Check className="size-4 text-[var(--fluent-accent)]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode Dropdowns Showcase (matching Image 5 Dark) */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 space-y-6 shadow-sm">
        <Caption color="muted" className="block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode (Image 5 Reference Layout)
        </Caption>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-40">
              <Select>
                <SelectTrigger triggerVariant="default" size="md" className="w-full">
                  <SelectValue placeholder="Text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dummyItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="surface-flyout w-full rounded-[var(--fluent-radius-flyout)] p-1.5 space-y-0.5">
              {dummyItems.map((item, idx) => (
                <div key={idx} className="flex h-8 items-center justify-between px-3 text-[14px] text-white/90 rounded-[var(--fluent-radius-control)] hover:bg-[rgba(255,255,255,0.065)] cursor-pointer transition-colors duration-[83ms]">
                  <span>{item}</span>
                  {idx === 0 && <Check className="size-3.5 stroke-[2.5] text-[var(--fluent-accent)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-44">
              <Select>
                <SelectTrigger
                  triggerVariant="with-icon"
                  leadingIcon={<Circle className="size-4" />}
                  size="md"
                  className="w-full"
                >
                  <SelectValue placeholder="Text" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dummyItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="surface-flyout w-full rounded-[var(--fluent-radius-flyout)] p-1.5 space-y-0.5">
              {dummyItems.map((item, idx) => (
                <div key={idx} className="flex h-8 items-center justify-between px-3 text-[14px] text-white/90 rounded-[var(--fluent-radius-control)] hover:bg-[rgba(255,255,255,0.065)] cursor-pointer transition-colors duration-[83ms]">
                  <span>{item}</span>
                  {idx === 1 && <Check className="size-3.5 stroke-[2.5] text-[var(--fluent-accent)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center space-y-3">
            <div>
              <Select>
                <SelectTrigger
                  triggerVariant="icon-only"
                  leadingIcon={<Circle className="size-4" />}
                  size="md"
                >
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dummyItems.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="surface-flyout w-full rounded-[var(--fluent-radius-flyout)] p-1.5 space-y-0.5">
              {dummyItems.map((item, idx) => (
                <div key={idx} className="flex h-8 items-center justify-between px-3 text-[14px] text-white/90 rounded-[var(--fluent-radius-control)] hover:bg-[rgba(255,255,255,0.065)] cursor-pointer transition-colors duration-[83ms]">
                  <span>{item}</span>
                  {idx === 2 && <Check className="size-3.5 stroke-[2.5] text-[var(--fluent-accent)]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 6. Image 1: Checkbox Matrix ─────────────────────────────────────────────

const CheckboxShowcase = () => {
  const [interactiveChecked, setInteractiveChecked] = useState<boolean | 'indeterminate'>(true)

  return (
    <div className="space-y-6">
      {/* Light Mode Matrix */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode (Image 1 Reference Matrix)
        </Caption>

        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[var(--fluent-border-subtle)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">State</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Unchecked Row */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">Unchecked</span></div>
          <div className="flex justify-center"><Checkbox checked={false} /></div>
          <div className="flex justify-center"><Checkbox checked={false} className="border-[rgba(0,0,0,0.65)] bg-[rgba(0,0,0,0.03)]" /></div>
          <div className="flex justify-center"><Checkbox checked={false} className="border-[rgba(0,0,0,0.80)] scale-95" /></div>
          <div className="flex justify-center"><Checkbox checked={false} disabled /></div>
          <div className="flex justify-center"><Checkbox checked={false} className="ring-2 ring-black ring-offset-2 ring-offset-white" /></div>
        </div>

        {/* Checked Row */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">Checked</span></div>
          <div className="flex justify-center"><Checkbox checked={true} /></div>
          <div className="flex justify-center"><Checkbox checked={true} className="bg-[var(--fluent-accent-hover)] border-[var(--fluent-accent-hover)]" /></div>
          <div className="flex justify-center"><Checkbox checked={true} className="bg-[var(--fluent-accent-pressed)] border-[var(--fluent-accent-pressed)] scale-95" /></div>
          <div className="flex justify-center"><Checkbox checked={true} disabled /></div>
          <div className="flex justify-center"><Checkbox checked={true} className="ring-2 ring-black ring-offset-2 ring-offset-white" /></div>
        </div>

        {/* Indeterminate Row */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">Indeterminate</span></div>
          <div className="flex justify-center"><Checkbox indeterminate /></div>
          <div className="flex justify-center"><Checkbox indeterminate className="bg-[var(--fluent-accent-hover)] border-[var(--fluent-accent-hover)]" /></div>
          <div className="flex justify-center"><Checkbox indeterminate className="bg-[var(--fluent-accent-pressed)] border-[var(--fluent-accent-pressed)] scale-95" /></div>
          <div className="flex justify-center"><Checkbox indeterminate disabled /></div>
          <div className="flex justify-center"><Checkbox indeterminate className="ring-2 ring-black ring-offset-2 ring-offset-white" /></div>
        </div>

        {/* With Label Row */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">With Label</span></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} disabled /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} className="ring-2 ring-black ring-offset-2 ring-offset-white" /></div>
        </div>
      </div>

      {/* Dark Mode Matrix */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode (Image 1 Reference Matrix)
        </Caption>

        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">State</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Unchecked Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">Unchecked</span></div>
          <div className="flex justify-center"><Checkbox checked={false} /></div>
          <div className="flex justify-center"><Checkbox checked={false} className="border-[rgba(255,255,255,0.65)] bg-[rgba(255,255,255,0.04)]" /></div>
          <div className="flex justify-center"><Checkbox checked={false} className="border-[rgba(255,255,255,0.80)] scale-95" /></div>
          <div className="flex justify-center"><Checkbox checked={false} disabled /></div>
          <div className="flex justify-center"><Checkbox checked={false} className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]" /></div>
        </div>

        {/* Checked Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">Checked</span></div>
          <div className="flex justify-center"><Checkbox checked={true} /></div>
          <div className="flex justify-center"><Checkbox checked={true} className="bg-[var(--fluent-accent-hover)] border-[var(--fluent-accent-hover)]" /></div>
          <div className="flex justify-center"><Checkbox checked={true} className="bg-[var(--fluent-accent-pressed)] border-[var(--fluent-accent-pressed)] scale-95" /></div>
          <div className="flex justify-center"><Checkbox checked={true} disabled /></div>
          <div className="flex justify-center"><Checkbox checked={true} className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]" /></div>
        </div>

        {/* Indeterminate Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">Indeterminate</span></div>
          <div className="flex justify-center"><Checkbox indeterminate /></div>
          <div className="flex justify-center"><Checkbox indeterminate className="bg-[var(--fluent-accent-hover)] border-[var(--fluent-accent-hover)]" /></div>
          <div className="flex justify-center"><Checkbox indeterminate className="bg-[var(--fluent-accent-pressed)] border-[var(--fluent-accent-pressed)] scale-95" /></div>
          <div className="flex justify-center"><Checkbox indeterminate disabled /></div>
          <div className="flex justify-center"><Checkbox indeterminate className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]" /></div>
        </div>

        {/* With Label Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">With Label</span></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} disabled /></div>
          <div className="flex justify-center"><CheckboxField label="Text" checked={false} className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]" /></div>
        </div>
      </div>

      {/* Interactive Toggle Sandbox */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[var(--fluent-surface-card)] p-5 flex flex-wrap items-center gap-6 shadow-2xs">
        <Caption color="muted" className="font-semibold uppercase tracking-wider text-[11px]">
          Interactive Test:
        </Caption>
        <CheckboxField
          label="Click to toggle states"
          description="Cycles between Checked, Indeterminate, and Unchecked"
          checked={interactiveChecked}
          onCheckedChange={() => {
            if (interactiveChecked === true) setInteractiveChecked('indeterminate')
            else if (interactiveChecked === 'indeterminate') setInteractiveChecked(false)
            else setInteractiveChecked(true)
          }}
        />
      </div>
    </div>
  )
}

// ─── 7. Image 2: Radio Button Matrix ──────────────────────────────────────────

const RadioShowcase = () => {
  const [selectedRadio, setSelectedRadio] = useState('opt1')

  return (
    <div className="space-y-6">
      {/* Light Mode Matrix */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode (Image 2 Reference Matrix)
        </Caption>

        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[var(--fluent-border-subtle)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">State</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Unchecked Row */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">Unchecked</span></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" className="border-[rgba(0,0,0,0.65)] bg-[rgba(0,0,0,0.03)]" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" className="border-[rgba(0,0,0,0.80)] scale-95" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" disabled /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" className="ring-2 ring-black ring-offset-2 ring-offset-white" /></RadioGroup></div>
        </div>

        {/* Checked Row */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">Checked</span></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" className="border-[var(--fluent-accent-hover)]" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" className="border-[var(--fluent-accent-pressed)] scale-95" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" disabled /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" className="ring-2 ring-black ring-offset-2 ring-offset-white" /></RadioGroup></div>
        </div>

        {/* With Label Row */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">With Label</span></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" disabled /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" className="ring-2 ring-black ring-offset-2 ring-offset-white" /></RadioGroup></div>
        </div>
      </div>

      {/* Dark Mode Matrix */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode (Image 2 Reference Matrix)
        </Caption>

        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">State</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Unchecked Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">Unchecked</span></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" className="border-[rgba(255,255,255,0.65)] bg-[rgba(255,255,255,0.04)]" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" className="border-[rgba(255,255,255,0.80)] scale-95" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" disabled /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupItem value="1" className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]" /></RadioGroup></div>
        </div>

        {/* Checked Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">Checked</span></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" className="border-[var(--fluent-accent-hover)]" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" className="border-[var(--fluent-accent-pressed)] scale-95" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" disabled /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="1"><RadioGroupItem value="1" className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]" /></RadioGroup></div>
        </div>

        {/* With Label Row (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">With Label</span></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" disabled /></RadioGroup></div>
          <div className="flex justify-center"><RadioGroup value="none"><RadioGroupField value="1" label="Text" className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]" /></RadioGroup></div>
        </div>
      </div>

      {/* Interactive Radio Group Sandbox */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[var(--fluent-surface-card)] p-5 shadow-2xs">
        <Caption color="muted" className="font-semibold uppercase tracking-wider text-[11px] block mb-3">
          Interactive Radio Selection:
        </Caption>
        <RadioGroup value={selectedRadio} onValueChange={setSelectedRadio} className="flex flex-wrap gap-6">
          <RadioGroupField value="opt1" label="Opción Predeterminada" description="Selección activa estándar" />
          <RadioGroupField value="opt2" label="Opción Secundaria" description="Cambia la selección con un clic" />
          <RadioGroupField value="opt3" label="Opción Deshabilitada" description="No seleccionable" disabled />
        </RadioGroup>
      </div>
    </div>
  )
}

// ─── 8. Images 3 & 4: Pill Matrix ─────────────────────────────────────────────

const PillShowcase = () => {
  return (
    <div className="space-y-6">
      {/* Image 3 Reference: Key Variants Showcase */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm space-y-4">
        <Caption color="muted" className="block font-semibold uppercase tracking-wider text-[11px]">
          Image 3 Reference: Variants (Text Only, Leading Icon, Accent)
        </Caption>
        <div className="flex flex-wrap items-center justify-around gap-4 p-6 rounded-lg bg-[#f5f5f5] border border-[rgba(0,0,0,0.06)]">
          <Pill variant="subtle" size="md">Text</Pill>
          <Pill variant="subtle" size="md" leadingIcon={<Calendar className="size-3.5" />}>Text</Pill>
          <Pill variant="accent" size="md">Text</Pill>
        </div>
      </div>

      {/* Image 4 Matrix: Light Mode */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode (Image 4 Reference Matrix)
        </Caption>

        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[var(--fluent-border-subtle)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">Variant</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Standard / Subtle Pill */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">Standard</span></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" className="bg-[rgba(0,0,0,0.08)]">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" className="bg-[rgba(0,0,0,0.12)] scale-95">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" disabled>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" className="ring-2 ring-black ring-offset-2 ring-offset-white">Text</Pill></div>
        </div>

        {/* Accent Pill */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[var(--fluent-border-subtle)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">Accent</span></div>
          <div className="flex justify-center"><Pill variant="accent" size="md">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" className="bg-[var(--fluent-accent-hover)]">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" className="bg-[var(--fluent-accent-pressed)] scale-95">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" disabled>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" className="ring-2 ring-black ring-offset-2 ring-offset-white">Text</Pill></div>
        </div>

        {/* Avatar Pill (Rows 5 & 6) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">With Avatar</span></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#0078d4] text-white size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>}>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#0078d4] text-white size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} className="bg-[rgba(0,0,0,0.08)]">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#0078d4] text-white size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} className="bg-[rgba(0,0,0,0.12)] scale-95">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#0078d4] text-white size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} disabled>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#0078d4] text-white size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} className="ring-2 ring-black ring-offset-2 ring-offset-white">Text</Pill></div>
        </div>
      </div>

      {/* Image 4 Matrix: Dark Mode */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode (Image 4 Reference Matrix)
        </Caption>

        <div className="grid grid-cols-6 gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)] text-center min-w-[540px]">
          <div className="text-left"><Caption color="muted" className="font-semibold">Variant</Caption></div>
          <div><Caption color="muted" className="font-semibold">Rest</Caption></div>
          <div><Caption color="muted" className="font-semibold">Hover</Caption></div>
          <div><Caption color="muted" className="font-semibold">Pressed</Caption></div>
          <div><Caption color="muted" className="font-semibold">Disabled</Caption></div>
          <div><Caption color="muted" className="font-semibold">Focus</Caption></div>
        </div>

        {/* Standard / Subtle Pill (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">Standard</span></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" className="bg-[rgba(255,255,255,0.12)]">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" className="bg-[rgba(255,255,255,0.16)] scale-95">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" disabled>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]">Text</Pill></div>
        </div>

        {/* Accent Pill (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center border-b border-[rgba(255,255,255,0.08)] min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">Accent</span></div>
          <div className="flex justify-center"><Pill variant="accent" size="md">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" className="bg-[var(--fluent-accent-hover)]">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" className="bg-[var(--fluent-accent-pressed)] scale-95">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" disabled>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="accent" size="md" className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]">Text</Pill></div>
        </div>

        {/* Avatar Pill (Dark) */}
        <div className="grid grid-cols-6 gap-3 py-3 items-center min-w-[540px]">
          <div><span className="inline-block rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">With Avatar</span></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#60cdff] text-[#002747] size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>}>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#60cdff] text-[#002747] size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} className="bg-[rgba(255,255,255,0.12)]">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#60cdff] text-[#002747] size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} className="bg-[rgba(255,255,255,0.16)] scale-95">Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#60cdff] text-[#002747] size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} disabled>Text</Pill></div>
          <div className="flex justify-center"><Pill variant="subtle" size="md" avatar={<span className="bg-[#60cdff] text-[#002747] size-full flex items-center justify-center text-[10px] font-bold"><User className="size-3" /></span>} className="ring-2 ring-white ring-offset-2 ring-offset-[#1e1e1e]">Text</Pill></div>
        </div>
      </div>
    </div>
  )
}

// ─── 9. Image 5: Text Box / Input Matrix ──────────────────────────────────────

const InputShowcase = () => {
  const [typingValue, setTypingValue] = useState('Text')

  return (
    <div className="space-y-6">
      {/* Light Mode Matrix */}
      <div className="rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[#fcfcfc] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Light Mode (Image 5 Reference Matrix)
        </Caption>

        {/* Row 1: No Text Entered */}
        <div className="space-y-3 pb-6 border-b border-[var(--fluent-border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">
              No Text entered
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Rest</Caption>
              <Input placeholder="Text" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Hover</Caption>
              <Input placeholder="Text" className="bg-[var(--fluent-btn-bg-hover)] border-[var(--fluent-btn-border-hover)]" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Focus (Active Underline)</Caption>
              <div className="group relative flex w-full items-center rounded-[var(--fluent-radius-control)] bg-[var(--fluent-btn-bg)] border border-[var(--fluent-btn-border-hover)] shadow-xs">
                <input placeholder="Text" readOnly className="w-full h-8 px-2.5 text-[14px] bg-transparent outline-none" />
                <span className="absolute inset-x-0 bottom-[-1px] h-[2px] rounded-b-[var(--fluent-radius-control)] bg-[var(--fluent-accent)]" />
              </div>
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Disabled</Caption>
              <Input placeholder="Text" disabled />
            </div>
          </div>
        </div>

        {/* Row 2: Text Entered */}
        <div className="space-y-3 py-6 border-b border-[var(--fluent-border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">
              Text Entered
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Rest</Caption>
              <Input defaultValue="Text" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Hover</Caption>
              <Input defaultValue="Text" className="bg-[var(--fluent-btn-bg-hover)] border-[var(--fluent-btn-border-hover)]" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Focus</Caption>
              <div className="group relative flex w-full items-center rounded-[var(--fluent-radius-control)] bg-[var(--fluent-btn-bg)] border border-[var(--fluent-btn-border-hover)] shadow-xs">
                <input defaultValue="Text" readOnly className="w-full h-8 px-2.5 text-[14px] bg-transparent outline-none" />
                <span className="absolute inset-x-0 bottom-[-1px] h-[2px] rounded-b-[var(--fluent-radius-control)] bg-[var(--fluent-accent)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Typing with Clear Button */}
        <div className="space-y-3 py-6 border-b border-[var(--fluent-border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">
              Typing (with Clear Button)
            </span>
          </div>
          <div className="max-w-md">
            <Input
              value={typingValue}
              onChange={(e) => setTypingValue(e.target.value)}
              clearable
              onClear={() => setTypingValue('')}
            />
          </div>
        </div>

        {/* Row 6: With Header / Label */}
        <div className="space-y-3 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold text-[var(--neutral-body)]">
              With Header / Label
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <InputField
              label="Header"
              placeholder="Text"
              description="Información de ayuda complementaria"
            />
            <InputField
              label="Header con Búsqueda"
              placeholder="Buscar elementos..."
              leadingIcon={<Search className="size-4" />}
              clearable
            />
          </div>
        </div>
      </div>

      {/* Dark Mode Matrix */}
      <div className="dark rounded-[var(--fluent-radius-window)] border border-[rgba(255,255,255,0.08)] bg-[#1e1e1e] p-6 shadow-sm overflow-x-auto">
        <Caption color="muted" className="mb-4 block font-semibold uppercase tracking-wider text-[11px]">
          Dark Mode (Image 5 Reference Matrix)
        </Caption>

        {/* Row 1: No Text Entered (Dark) */}
        <div className="space-y-3 pb-6 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">
              No Text entered
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Rest</Caption>
              <Input placeholder="Text" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Hover</Caption>
              <Input placeholder="Text" className="bg-[var(--fluent-btn-bg-hover)] border-[var(--fluent-btn-border-hover)]" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Focus (Active Underline)</Caption>
              <div className="group relative flex w-full items-center rounded-[var(--fluent-radius-control)] bg-[var(--fluent-btn-bg)] border border-[var(--fluent-btn-border-hover)] shadow-xs">
                <input placeholder="Text" readOnly className="w-full h-8 px-2.5 text-[14px] bg-transparent outline-none text-white" />
                <span className="absolute inset-x-0 bottom-[-1px] h-[2px] rounded-b-[var(--fluent-radius-control)] bg-[var(--fluent-accent)]" />
              </div>
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Disabled</Caption>
              <Input placeholder="Text" disabled />
            </div>
          </div>
        </div>

        {/* Row 2: Text Entered (Dark) */}
        <div className="space-y-3 py-6 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">
              Text Entered
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Rest</Caption>
              <Input defaultValue="Text" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Hover</Caption>
              <Input defaultValue="Text" className="bg-[var(--fluent-btn-bg-hover)] border-[var(--fluent-btn-border-hover)]" />
            </div>
            <div className="space-y-1">
              <Caption color="muted" className="text-[11px]">Focus</Caption>
              <div className="group relative flex w-full items-center rounded-[var(--fluent-radius-control)] bg-[var(--fluent-btn-bg)] border border-[var(--fluent-btn-border-hover)] shadow-xs">
                <input defaultValue="Text" readOnly className="w-full h-8 px-2.5 text-[14px] bg-transparent outline-none text-white" />
                <span className="absolute inset-x-0 bottom-[-1px] h-[2px] rounded-b-[var(--fluent-radius-control)] bg-[var(--fluent-accent)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 6: With Header / Label (Dark) */}
        <div className="space-y-3 pt-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[rgba(255,255,255,0.1)] px-2 py-0.5 text-[11px] font-semibold text-white/80">
              With Header / Label
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <InputField
              label="Header"
              placeholder="Text"
              description="Información de ayuda complementaria"
            />
            <InputField
              label="Header con Búsqueda"
              placeholder="Buscar elementos..."
              leadingIcon={<Search className="size-4" />}
              clearable
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export const DesignSystemPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  if (!import.meta.env.DEV) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Body color="muted">Esta página solo está disponible en modo desarrollo.</Body>
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[var(--fluent-surface-base)] text-[var(--neutral-emphasis)] transition-colors duration-200">
        <div className="mx-auto max-w-5xl px-6 py-10 space-y-12">

          {/* Page Top Bar */}
          <div className="flex items-start justify-between">
            <div>
              <Display as="h1" color="emphasis">Fluent Design System 2.0</Display>
              <Body color="muted" as="p" className="mt-1">
                Atoms Showcase · Branch{' '}
                <code className="rounded bg-[var(--fluent-border-subtle)] px-2 py-0.5 text-[12px] font-mono font-semibold">
                  design/visual-system
                </code>
              </Body>
            </div>
            <button
              onClick={() => setIsDarkMode(d => !d)}
              className="inline-flex items-center gap-2 rounded-[var(--fluent-radius-control)] border border-[var(--fluent-btn-border)] bg-[var(--fluent-btn-bg)] px-3.5 py-2 text-[13px] font-semibold text-[var(--fluent-btn-fg)] shadow-[var(--fluent-shadow-control)] hover:bg-[var(--fluent-btn-bg-hover)] transition-all cursor-pointer"
            >
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* 1. Type Ramp */}
          <Section title="1. Text — Segoe UI Variable Type Ramp" subtitle="Hierarchy defined by STYLE_GUIDE.md">
            <div className="space-y-3 rounded-[var(--fluent-radius-window)] border border-[var(--fluent-border-subtle)] bg-[var(--fluent-surface-card)] p-6 shadow-sm">
              <Display as="p" color="emphasis">Display — 40/52 Semibold</Display>
              <TitleLarge as="p" color="emphasis">Title Large — 28/36 Semibold</TitleLarge>
              <Title as="p" color="emphasis">Title — 20/28 Semibold</Title>
              <Subtitle as="p" color="emphasis">Subtitle — 18/24 Regular</Subtitle>
              <Subtitle as="p" weight="semibold" color="emphasis">Subtitle Semibold — 18/24</Subtitle>
              <BodyStrong as="p" color="emphasis">Body Strong — 14/20 Semibold</BodyStrong>
              <Body as="p" color="body">Body — 14/20 Regular. Standard UI body text with optimal 50-60 character line length.</Body>
              <Caption as="p" color="muted">Caption — 12/16 Regular. Used in confined spaces, command buttons, and metadata.</Caption>
            </div>
          </Section>

          {/* 2. Interactive Item States (Image 1) */}
          <Section title="2. Interactive Text & List Item States" subtitle="Image 1 Reference: Rest, Hover, Pressed, Disabled, Focus">
            <InteractiveItemStates />
          </Section>

          {/* 3. Surfaces & Materials (Images 2 & 3) */}
          <Section title="3. Surfaces & Materials (Mica & Acrylic)" subtitle="Images 2 & 3 Reference: Card, Flyout, Dialog, Shell, Thin Acrylic">
            <SurfaceShowcase />
          </Section>

          {/* 4. Buttons (Image 4) */}
          <Section title="4. Button States Matrix" subtitle="Image 4 Reference: Accent & Standard (Rest, Hover, Pressed, Disabled, Focus)">
            <ButtonMatrix />
          </Section>

          {/* 5. Dropdowns (Image 5) */}
          <Section title="5. Dropdown Variants & Flyouts" subtitle="Image 5 Reference: Text Only, With Icon, Icon Only (Light & Dark)">
            <DropdownShowcase />
          </Section>

          {/* 6. Checkbox (Image 1) */}
          <Section title="6. Checkbox" subtitle="Image 1 Reference: Unchecked, Checked, Indeterminate (Rest, Hover, Pressed, Disabled, Focus)">
            <CheckboxShowcase />
          </Section>

          {/* 7. Radio Buttons (Image 2) */}
          <Section title="7. Radio Buttons" subtitle="Image 2 Reference: Unchecked & Checked with Accent Concentric Ring + Dot">
            <RadioShowcase />
          </Section>

          {/* 8. Pills / Chips (Images 3 & 4) */}
          <Section title="8. Pills & Badges" subtitle="Images 3 & 4 Reference: Subtle, Accent, Leading Icon, and Avatar Pills">
            <PillShowcase />
          </Section>

          {/* 9. Text Box / Input (Image 5) */}
          <Section title="9. Text Box / Input" subtitle="Image 5 Reference: Active Accent Bottom Underline, Clear Action, and Labelled Fields">
            <InputShowcase />
          </Section>

          {/* Footer */}
          <footer className="border-t border-[var(--fluent-border-subtle)] pt-6 text-center">
            <Caption color="muted">
              equa-gestion · Design System 2.0 · Ready for component migration
            </Caption>
          </footer>

        </div>
      </div>
    </div>
  )
}

export default DesignSystemPage

