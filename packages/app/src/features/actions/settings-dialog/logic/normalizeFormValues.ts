import BigNumber from 'bignumber.js'

import { Percentage } from '@/domain/types/NumericValues'

import { ActionSettingsSchema, SlippageInputType } from './form'

export interface ActionSettingsFormValues {
  slippage: {
    type: SlippageInputType
    value: Percentage
  }
}

export function normalizeFormValues(values: ActionSettingsSchema): ActionSettingsFormValues {
  return {
    slippage: {
      type: values.slippage.type,
      value: Percentage(BigNumber(values.slippage.value).div(100)),
    },
  }
}
