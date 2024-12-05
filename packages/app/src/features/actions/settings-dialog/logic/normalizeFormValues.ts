import BigNumber from 'bignumber.js'

import { Percentage } from '@marsfoundation/common-universal'

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
      value: Percentage(BigNumber(values.slippage.value === '' ? 0 : values.slippage.value).div(100)),
    },
  }
}
