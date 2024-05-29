import { UseFormReturn } from 'react-hook-form'

import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { PREDEFINED_SLIPPAGES } from '@/features/actions/settings-dialog/constants'
import { testIds } from '@/ui/utils/testIds'

import { ActionSettingsSchema } from '../../logic/form'
import { UseSlippageFormResult } from '../../logic/useSlippageForm'
import { ControlledSlippageInput } from './ControlledSlippageInput'
import { SlippageButton } from './SlippageButton'

interface SlippageFormProps {
  form: UseFormReturn<ActionSettingsSchema>
  onSlippageChange: UseSlippageFormResult['onSlippageChange']
  type: ActionSettingsSchema['slippage']['type']
  slippage: Percentage
  error?: string
}

export function SlippageForm({ form, onSlippageChange, type, slippage, error }: SlippageFormProps) {
  return (
    <div className="cols-start-1 col-span-full flex-col">
      <div className="flex gap-1.5 sm:h-14 sm:gap-2.5">
        {PREDEFINED_SLIPPAGES.map((predefinedSlippage) => {
          const formattedSlippage = formatPercentage(predefinedSlippage, { minimumFractionDigits: 0 })
          return (
            <SlippageButton
              isActive={type === 'button' && slippage.eq(predefinedSlippage)}
              key={predefinedSlippage.toString()}
              onClick={() => onSlippageChange(predefinedSlippage, 'button')}
            >
              {formattedSlippage}
            </SlippageButton>
          )
        })}
        <ControlledSlippageInput
          form={form}
          onSlippageChange={onSlippageChange}
          isActive={type === 'input'}
          error={error}
        />
      </div>
      {error && (
        <div className='mt-2 flex justify-end text-error text-xs' data-testid={testIds.actions.settings.slippage.error}>
          {error}
        </div>
      )}
    </div>
  )
}
