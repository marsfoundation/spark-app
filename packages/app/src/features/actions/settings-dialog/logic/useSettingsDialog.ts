import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { useActionsSettings } from '@/domain/state'
import { Percentage } from '@/domain/types/NumericValues'

import { ActionSettingsSchema, SlippageInputType } from './form'
import { normalizeFormValues } from './normalizeFormValues'
import { useSlippageForm, UseSlippageFormResult } from './useSlippageForm'

export interface UseSettingsDialogResult {
  permitsSettings: {
    preferPermits: boolean
    togglePreferPermits: () => void
  }
  slippageSettings: {
    form: UseFormReturn<ActionSettingsSchema>
    type: SlippageInputType
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
  const normalizedFormValues = normalizeFormValues(form.watch())

  function onConfirm(): void {
    actionsSettings.setExchangeMaxSlippage(normalizedFormValues.slippage.value)
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
      type: normalizedFormValues.slippage.type,
      error: form.formState.errors.slippage?.message,
      slippage: normalizedFormValues.slippage.value,
    },
    onConfirm,
  }
}
