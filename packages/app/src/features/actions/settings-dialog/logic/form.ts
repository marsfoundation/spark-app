import { z } from 'zod'

export const SlippageInputSchema = z.object({
  type: z.enum(['button', 'input']),
  value: z.string().refine((value) => {
    const numberValue = parseFloat(value)
    return !isNaN(numberValue) && numberValue > 0 && numberValue < 50
  }, 'Value have to be greater than 0 and less than 50'),
})

export type SlippageInputSchema = z.infer<typeof SlippageInputSchema>
