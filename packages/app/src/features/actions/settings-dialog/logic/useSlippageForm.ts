import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'

import { useStore } from '@/domain/state'
import { Percentage } from '@/domain/types/NumericValues'

import { PREDEFINED_SLIPPAGES } from '../constants'
import { ActionSettingsSchema, formatPercentageFormValue } from './form'

export interface UseSlippageFormResult {
  form: UseFormReturn<ActionSettingsSchema>
  onSlippageChange: (value: string | Percentage, type: 'input' | 'button') => void
}

export function useSlippageForm(): UseSlippageFormResult {
  const initialSlippage = useStore((state) => state.actionsSettings.exchangeMaxSlippage)
  const initialSlippageType = PREDEFINED_SLIPPAGES.some((slippage) => slippage.eq(initialSlippage)) ? 'button' : 'input'

  const form = useForm<ActionSettingsSchema>({
    resolver: zodResolver(ActionSettingsSchema),
    defaultValues: {
      slippage: {
        value: formatPercentageFormValue(initialSlippage),
        type: initialSlippageType,
      },
    },
    mode: 'onChange',
  })

  function onSlippageChange(value: string | Percentage, type: 'input' | 'button'): void {
    const stringifiedValue = typeof value === 'string' ? value : formatPercentageFormValue(value)

    form.setValue(
      'slippage',
      {
        value: stringifiedValue,
        type,
      },
      { shouldValidate: true },
    )
  }

  return {
    form,
    onSlippageChange,
  }
}
