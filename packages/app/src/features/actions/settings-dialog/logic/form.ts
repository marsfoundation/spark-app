import { z } from 'zod'

import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@marsfoundation/common-universal'

export const SlippageInputType = z.enum(['button', 'input'])
export type SlippageInputType = z.infer<typeof SlippageInputType>

export const ActionSettingsSchema = z.object({
  slippage: z.object({
    type: SlippageInputType,
    value: z.string().refine(
      (value) => {
        const slippage = Number.parseFloat(value)
        return !Number.isNaN(slippage) && slippage > 0 && slippage < 50
      },
      {
        message: 'Value has to be greater than 0 and less than 50',
      },
    ),
  }),
})
export type ActionSettingsSchema = z.infer<typeof ActionSettingsSchema>

export function formatPercentageFormValue(value: Percentage): string {
  return formatPercentage(value, { minimumFractionDigits: 0, skipSign: true })
}
