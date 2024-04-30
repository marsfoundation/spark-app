import { z } from 'zod'

export const SlippageInputSchema = z.object({
  type: z.enum(['button', 'input']),
  slippage: z.string().refine(
    (value) => {
      const slippage = parseFloat(value)
      return !isNaN(slippage) && slippage > 0 && slippage < 50
    },
    {
      message: 'Value has to be greater than 0 and less than 50',
    },
  ),
})

export type SlippageInputSchema = z.infer<typeof SlippageInputSchema>
