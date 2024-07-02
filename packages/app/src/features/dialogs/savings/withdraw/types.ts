import { nonStrictViemAddressSchema } from '@/domain/common/validation'
import { z } from 'zod'

export type Mode = 'withdraw' | 'send'

export const ReceiverFormSchema = z.object({
  receiver: nonStrictViemAddressSchema,
})
export type ReceiverFormSchema = z.infer<typeof ReceiverFormSchema>
