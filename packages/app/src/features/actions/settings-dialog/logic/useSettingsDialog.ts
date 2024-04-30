import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { useActionsSettings } from '@/domain/state'
import { Percentage } from '@/domain/types/NumericValues'

import { SlippageInputSchema } from './form'
import { useSlippageForm, UseSlippageFormResult } from './useSlippageForm'

export interface UseSettingsDialogResult {
  permitsSettings: {
    preferPermits: boolean
    togglePreferPermits: () => void
  }
  slippageSettings: {
    form: UseFormReturn<SlippageInputSchema>
    type: SlippageInputSchema['type']
    slippage: Percentage
    onSlippageChange: UseSlippageFormResult['onSlippageChange']
    error?: string
  }
  onConfirm: () => void
}

export function useSettingsDialog(): UseSettingsDialogResult {
  const actionsSettings = useActionsSettings()
  const [preferPermits, setPreferPermits] = useState(actionsSettings.preferPermits)
  const { form, onSlippageChange } = useSlippageForm()
  const slippage = Percentage(Number(form.watch().slippage) / 100, true)

  function onConfirm(): void {
    const formSlippage = form.getValues('slippage')
    const slippage = Percentage(Number(formSlippage) / 100)
    actionsSettings.setExchangeMaxSlippage(slippage)
    actionsSettings.setPreferPermits(preferPermits)
  }

  return {
    permitsSettings: {
      preferPermits,
      togglePreferPermits: () => setPreferPermits((prefer) => !prefer),
    },
    slippageSettings: {
      form,
      onSlippageChange,
      type: form.getValues('type'),
      error: form.formState.errors.slippage?.message,
      slippage,
    },
    onConfirm,
  }
}
