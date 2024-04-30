import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'

import { formatPercentage } from '@/domain/common/format'
import { useActionsSettings } from '@/domain/state'

import { SlippageInputSchema } from './form'

export interface UseSlippageFormResult {
  form: UseFormReturn<SlippageInputSchema>
  onSlippageChange: (value: string, type: 'input' | 'button') => void
}

export function useSlippageForm(): UseSlippageFormResult {
  const { exchangeMaxSlippage } = useActionsSettings()
  const form = useForm<SlippageInputSchema>({
    resolver: zodResolver(SlippageInputSchema),
    defaultValues: {
      type: 'input',
      value: formatPercentage(exchangeMaxSlippage, { minimumFractionDigits: 0 }),
    },
  })

  function onSlippageChange(value: string, type: 'input' | 'button'): void {
    form.setValue('value', value)
    form.setValue('type', type)
  }

  return {
    form,
    onSlippageChange,
  }
}
