import { z } from 'zod'

export const SlippageInputType = z.enum(['button', 'input'])
export type SlippageInputType = z.infer<typeof SlippageInputType>

export const ActionSettingsSchema = z.object({
  slippage: z.object({
    type: SlippageInputType,
    value: z.string().refine(
      (value) => {
        const slippage = parseFloat(value)
        return !isNaN(slippage) && slippage > 0 && slippage < 50
      },
      {
        message: 'Value has to be greater than 0 and less than 50',
      },
    ),
  }),
})
export type ActionSettingsSchema = z.infer<typeof ActionSettingsSchema>
