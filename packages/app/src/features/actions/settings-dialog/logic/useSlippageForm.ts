import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'

import { formatPercentage } from '@/domain/common/format'

import { DEFAULT_SLIPPAGE } from '../constants'
import { SlippageInputSchema } from './form'

export interface UseSlippageFormResult {
  form: UseFormReturn<SlippageInputSchema>
  onSlippageChange: (slippage: string, type: 'input' | 'button') => void
}

export function useSlippageForm(): UseSlippageFormResult {
  const form = useForm<SlippageInputSchema>({
    resolver: zodResolver(SlippageInputSchema),
    defaultValues: {
      type: 'button',
      slippage: formatPercentage(DEFAULT_SLIPPAGE, { minimumFractionDigits: 0, skipSign: true }),
    },
    mode: 'onChange',
  })

  function onSlippageChange(slippage: string, type: 'input' | 'button'): void {
    form.setValue('slippage', slippage)
    form.setValue('type', type)
  }

  return {
    form,
    onSlippageChange,
  }
}
