import { Controller, UseFormReturn } from 'react-hook-form'

import { SlippageInputSchema } from '../../logic/form'
import { UseSlippageFormResult } from '../../logic/useSlippageForm'
import { SlippageInput } from './SlippageInput'

interface ControlledSlippageInputProps {
  form: UseFormReturn<SlippageInputSchema>
  onSlippageChange: UseSlippageFormResult['onSlippageChange']
  isActive: boolean
  error?: string
}

export function ControlledSlippageInput({ form, onSlippageChange, isActive, error }: ControlledSlippageInputProps) {
  return (
    <Controller
      control={form.control}
      name="slippage"
      render={({ field }) => (
        <SlippageInput
          {...field}
          value={isActive ? field.value : ''}
          isActive={isActive}
          error={error}
          onChange={(e) => {
            onSlippageChange(e.target.value, 'input')
          }}
        />
      )}
    />
  )
}
