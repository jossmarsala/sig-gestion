/**
 * Text Box / Input — Atom A-08
 * Fluent Design 2 · TextBox spec
 *
 * Reference: Image 5 (Empty, Filled, Typing with Clear button, Selected, With Header/Label across Light & Dark)
 * Features Fluent 2 hallmark: 2px active accent bottom indicator, uniform 1px perimeter, and optional clear action.
 */
import React, { useState, useRef, useImperativeHandle } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Leading icon slot (e.g. Search, Mail) */
  leadingIcon?: React.ReactNode
  /** Trailing icon slot (rendered before clear button if present) */
  trailingIcon?: React.ReactNode
  /** Shows a clear (X) button when value is non-empty (Image 5 rows 3, 4, 5) */
  clearable?: boolean
  /** Callback fired when clear button is clicked */
  onClear?: () => void
  /** Semantic error state */
  error?: boolean
  /** Size ramp: sm (28px), md (32px standard), lg (36px) */
  inputSize?: 'sm' | 'md' | 'lg'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      value,
      defaultValue,
      onChange,
      onClear,
      clearable = false,
      leadingIcon,
      trailingIcon,
      error = false,
      disabled = false,
      readOnly = false,
      inputSize = 'md',
      ...props
    },
    forwardedRef
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)

    // Track internal value for uncontrolled inputs when clearable is active
    const [internalValue, setInternalValue] = useState(defaultValue ?? '')
    const isControlled = value !== undefined
    const currentValue = isControlled ? String(value ?? '') : String(internalValue ?? '')
    const hasValue = currentValue.length > 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isControlled) {
        setInternalValue('')
      }
      if (inputRef.current) {
        inputRef.current.value = ''
        // Dispatch synthetic change event for React listeners
        const event = new Event('input', { bubbles: true })
        inputRef.current.dispatchEvent(event)
        inputRef.current.focus()
      }
      onClear?.()
    }

    // Size height and padding maps
    const sizeMap = {
      sm: 'h-7 text-[13px] px-2',
      md: 'h-8 text-[14px] px-2.5', // Fluent 2 standard: 32px height
      lg: 'h-9 text-[15px] px-3',
    }

    return (
      <div
        className={cn(
          // Outer wrapper for border, background, and the 2px active accent bottom indicator
          'group relative flex w-full items-center select-none',
          'rounded-[var(--fluent-radius-control)]',
          'bg-[var(--fluent-btn-bg)] text-[var(--fluent-btn-fg)]',
          'border border-[var(--fluent-btn-border)]',
          'shadow-[var(--fluent-shadow-control)]',
          'transition-all duration-[120ms] ease-[cubic-bezier(0,0,0,1)]',

          // Hover
          !disabled && !readOnly && [
            'hover:bg-[var(--fluent-btn-bg-hover)]',
            'hover:border-[var(--fluent-btn-border-hover)]',
            'hover:shadow-[var(--fluent-shadow-control-hover)]',
          ],

          // Focus-within (Fluent 2 border highlight)
          !disabled && !readOnly && 'focus-within:border-[var(--fluent-btn-border-hover)]',

          // Error state
          error && 'border-[var(--fluent-destructive)] dark:border-[var(--fluent-destructive)]',

          // Disabled state (Image 5 Column 4)
          disabled && [
            'pointer-events-none cursor-not-allowed',
            'bg-[rgba(255,255,255,0.30)] border-[rgba(0,0,0,0.04)] shadow-none',
            'dark:bg-[rgba(255,255,255,0.03)] dark:border-[rgba(255,255,255,0.04)]',
          ],

          className
        )}
      >
        {/* Leading icon */}
        {leadingIcon && (
          <span
            className={cn(
              'pointer-events-none shrink-0 pl-2.5 text-[var(--neutral-muted)] opacity-70',
              disabled && 'opacity-40'
            )}
          >
            {leadingIcon}
          </span>
        )}

        {/* The Native HTML Input */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          className={cn(
            'w-full bg-transparent outline-none border-none ring-0',
            'font-[\'Segoe_UI_Variable\',_\'Segoe_UI\',_system-ui,_-apple-system,_sans-serif]',
            'leading-[20px] antialiased',
            'placeholder:text-[var(--neutral-muted)] placeholder:opacity-60',
            'selection:bg-[var(--fluent-accent)] selection:text-white dark:selection:text-[#002747]',
            sizeMap[inputSize],
            leadingIcon && 'pl-2',
            (trailingIcon || (clearable && hasValue)) && 'pr-1.5',
            disabled && 'text-[var(--neutral-muted)] opacity-50 cursor-not-allowed'
          )}
          {...props}
        />

        {/* Trailing Icon */}
        {trailingIcon && (
          <span className="pointer-events-none shrink-0 pr-2 text-[var(--neutral-muted)] opacity-70">
            {trailingIcon}
          </span>
        )}

        {/* Clear (X) Button — Image 5 rows 3, 4, 5 */}
        {clearable && hasValue && !disabled && !readOnly && (
          <button
            type="button"
            aria-label="Clear text"
            onClick={handleClear}
            tabIndex={-1}
            className={cn(
              'mr-1.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[var(--neutral-muted)]',
              'transition-all duration-100 ease-out',
              'hover:bg-[var(--fluent-item-hover)] hover:text-[var(--fluent-btn-fg)]',
              'active:bg-[var(--fluent-item-pressed)] active:scale-90',
              'focus:outline-none'
            )}
          >
            <X className="size-3.5 stroke-[2]" />
          </button>
        )}

        {/* Fluent 2 Active Accent Bottom Underline Indicator (Image 5 column 3) */}
        {!disabled && !readOnly && (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-[-1px] h-[2px] rounded-b-[var(--fluent-radius-control)]',
              'transition-transform duration-[150ms] ease-[cubic-bezier(0,0,0,1)]',
              error ? 'bg-[var(--fluent-destructive)]' : 'bg-[var(--fluent-accent)]',
              'scale-x-0 group-focus-within:scale-x-100'
            )}
          />
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ── Input Field with Label / Header compound (Image 5 Row 6) ─────────────────

export interface InputFieldProps extends InputProps {
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode
  id?: string
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, label, description, errorMessage, error, className, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const hasError = Boolean(error || errorMessage)

    return (
      <div className={cn('grid gap-1 select-none', disabled && 'opacity-60')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'font-[\'Segoe_UI_Variable\',_\'Segoe_UI\',_system-ui,_-apple-system,_sans-serif]',
              'text-[14px] font-medium leading-[18px] text-[var(--fluent-btn-fg)]',
              disabled && 'cursor-not-allowed'
            )}
          >
            {label}
          </label>
        )}
        <Input
          id={inputId}
          ref={ref}
          error={hasError}
          disabled={disabled}
          className={className}
          {...props}
        />
        {description && !hasError && (
          <p className="text-[12px] leading-[16px] text-[var(--neutral-muted)]">
            {description}
          </p>
        )}
        {hasError && errorMessage && (
          <p className="text-[12px] leading-[16px] font-medium text-[var(--fluent-destructive)]">
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
InputField.displayName = 'InputField'

