import { InputHTMLAttributes } from 'react'

import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { PREDEFINED_SLIPPAGES } from '@/features/actions/constants'

import { SlippageButton } from './SlippageButton'
import { SlippageInput } from './SlippageInput'

interface SlippageFormProps extends InputHTMLAttributes<HTMLInputElement> {
  fieldType: 'button' | 'input'
  fieldValue: Percentage
  error?: string
}

export function SlippageForm({ fieldType, fieldValue, error }: SlippageFormProps) {
  const formattedValue = formatPercentage(fieldValue, { skipSign: true })

  return (
    <div className="col-span-full col-start-1 grid grid-cols-[repeat(3,auto)_1fr] gap-1.5 sm:h-14 sm:gap-2.5">
      {PREDEFINED_SLIPPAGES.map((slippage) => (
        <SlippageButton isActive={fieldType === 'button' && fieldValue.eq(slippage)} key={slippage.toString()}>
          {formatPercentage(slippage, { minimumFractionDigits: 0 })}
        </SlippageButton>
      ))}
      <SlippageInput value={fieldType === 'input' ? formattedValue : ''} onChange={() => {}} error={error} />
      {error && (
        <div className="text-error col-span-full ml-auto text-xs sm:col-span-1 sm:col-start-4 sm:m-0">{error}</div>
      )}
    </div>
  )
}
