import { nonStrictViemAddressSchema } from '@/domain/common/validation'
import { UseFormReturn } from 'react-hook-form'
import { Address } from 'viem'
import { z } from 'zod'

export type Mode = 'default' | 'send'

export const ReceiverFormSchema = z.object({
  receiver: nonStrictViemAddressSchema,
})
export type ReceiverFormSchema = z.infer<typeof ReceiverFormSchema>

export interface SendModeOptions {
  isSendMode: true
  receiverForm: UseFormReturn<ReceiverFormSchema>
  receiver: Address
  blockExplorerAddressLink?: string
}
