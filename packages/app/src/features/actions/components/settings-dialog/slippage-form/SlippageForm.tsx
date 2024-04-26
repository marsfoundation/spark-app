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
    <div className="cols-start-1 col-span-full flex-col">
      <div className="flex gap-1.5 sm:h-14 sm:gap-2.5">
        {PREDEFINED_SLIPPAGES.map((slippage) => (
          <SlippageButton isActive={fieldType === 'button' && fieldValue.eq(slippage)} key={slippage.toString()}>
            {formatPercentage(slippage, { minimumFractionDigits: 0 })}
          </SlippageButton>
        ))}
        <SlippageInput value={fieldType === 'input' ? formattedValue : ''} onChange={() => {}} error={error} />
      </div>
      {error && <div className="text-error mt-2 flex justify-end text-xs">{error}</div>}
    </div>
  )
}
