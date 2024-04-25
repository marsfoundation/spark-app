import { ReactNode } from 'react'

import { cn } from '@/ui/utils/style'

export function SlippageForm() {
  return (
    <div className="grid grid-cols-[repeat(3,auto)_1fr] gap-2.5">
      {['0.1%', '0.5%', '1%'].map((slippage) => (
        <SlippageButton isActive={false} key={slippage}>
          {slippage}
        </SlippageButton>
      ))}
      <SlippageInput onChange={() => {}} />
    </div>
  )
}

interface SlippageButtonProps {
  children: ReactNode
  isActive: boolean
}

function SlippageButton({ children, isActive }: SlippageButtonProps) {
  return (
    <button
      className={cn(
        'flex h-[56px] w-[60px] items-center justify-center',
        'border-basics-border rounded-xl border bg-white',
        'hover:bg-basics-light-grey transition-colors duration-200',
        'text-basics-dark-grey hover:shadow-sm',
        isActive && 'border-main-blue text-basics-black',
      )}
    >
      {children}
    </button>
  )
}

interface SlippageInputProps {
  value?: string
  onChange: (value: string) => void
  error?: string
}

function SlippageInput({ value, onChange, error }: SlippageInputProps) {
  return (
    <div className="border-basics-border text-basics-dark-grey relative flex h-[56px] w-full flex-grow items-center rounded-xl border">
      <input
        type="text"
        inputMode="decimal"
        className={cn('flex h-full w-full pl-4 focus:outline-none', error && 'text-error')}
        maxLength={6}
        placeholder="Custom"
        value={value}
        onChange={(e) => {
          e.target.value = e.target.value.replace(/,/g, '.')
          onChange(e.target.value)
        }}
      />
      <div className="absolute right-0 mr-4 cursor-default">%</div>
    </div>
  )
}
