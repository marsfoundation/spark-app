import { InputHTMLAttributes } from 'react'

import { cn } from '@/ui/utils/style'

interface SlippageInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  error?: string
}

const decimalNumberRegex = /^\d+\.?\d*$/

export function SlippageInput({ value, error, onChange, ...rest }: SlippageInputProps) {
  return (
    <div
      className={cn(
        'border-basics-border text-basics-dark-grey relative flex',
        'w-full flex-grow items-center rounded-xl border text-sm sm:text-base',
        value !== '' && 'border-main-blue text-basics-black',
        error && 'border-error bg-error/10 text-error',
      )}
    >
      <input
        className={cn('flex h-full w-full pl-3 focus:outline-none sm:pl-4')}
        maxLength={6}
        placeholder="Custom"
        value={value}
        type="text"
        inputMode="decimal"
        {...rest}
        onChange={(e) => {
          if (decimalNumberRegex.test(e.target.value)) {
            e.target.value = e.target.value.replace(/,/g, '.')
            onChange?.(e)
          }
        }}
      />
      <div className="absolute right-0 mr-3 cursor-default sm:mr-4">%</div>
    </div>
  )
}
