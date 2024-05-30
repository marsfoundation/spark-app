import { InputHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/ui/utils/style'

interface SlippageInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isActive: boolean
  error?: string
}

const decimalNumberRegex = /^\d+\.?\d*$/

export const SlippageInput = forwardRef<HTMLInputElement, SlippageInputProps>(
  ({ isActive, error, onChange, ...rest }, ref) => {
    return (
      <div
        className={cn(
          'relative flex border-basics-border text-basics-dark-grey',
          'w-full flex-grow items-center rounded-xl border text-sm sm:text-base',
          isActive && 'border-main-blue text-basics-black',
          error && 'border-error bg-error/10 text-error',
        )}
      >
        <input
          className={cn('flex h-full w-full rounded-xl pl-3 sm:pl-4', error && 'outline-error')}
          maxLength={6}
          ref={ref}
          placeholder="Custom"
          type="text"
          inputMode="decimal"
          {...rest}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/,/g, '.')
            if (!e.target.value || decimalNumberRegex.test(e.target.value)) {
              onChange?.(e)
            }
          }}
        />
        <div className="absolute right-0 mr-3 cursor-default sm:mr-4">%</div>
      </div>
    )
  },
)
SlippageInput.displayName = 'SlippageInput'
