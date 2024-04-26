import { InputHTMLAttributes } from 'react'

import { DecimalInput } from '@/ui/atoms/decimal-input/DecimalInput'
import { cn } from '@/ui/utils/style'

interface SlippageInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string
  error?: string
}

export function SlippageInput({ value, error, ...rest }: SlippageInputProps) {
  return (
    <div
      className={cn(
        'border-basics-border text-basics-dark-grey relative flex',
        'w-full flex-grow items-center rounded-xl border text-sm sm:text-base',
        value !== '' && 'border-main-blue text-basics-black',
        error && 'border-error bg-error/10 text-error',
      )}
    >
      <DecimalInput
        className={cn('flex h-full w-full pl-3 focus:outline-none sm:pl-4')}
        maxLength={6}
        placeholder="Custom"
        value={value}
        {...rest}
      />
      <div className="absolute right-0 mr-3 cursor-default sm:mr-4">%</div>
    </div>
  )
}
