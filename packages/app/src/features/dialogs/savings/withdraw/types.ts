import { UseFormReturn } from 'react-hook-form'
import { Address } from 'viem'
import { z } from 'zod'

export type Mode = 'default' | 'send'

export const ReceiverFormSchema = z.object({
  receiver: z.string(),
})
export type ReceiverFormSchema = z.infer<typeof ReceiverFormSchema>

export interface SendModeExtension {
  receiverForm: UseFormReturn<ReceiverFormSchema>
  receiver: Address
  blockExplorerAddressLink?: string
  enableActions: boolean
}
