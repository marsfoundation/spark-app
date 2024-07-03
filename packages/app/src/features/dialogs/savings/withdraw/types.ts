import { UseFormReturn } from 'react-hook-form'
import { Address } from 'viem'
import { z } from 'zod'

export type Mode = 'withdraw' | 'send'

export const ReceiverFormSchema = z.object({
  receiver: z.string(),
})
export type ReceiverFormSchema = z.infer<typeof ReceiverFormSchema>

export interface SendModeExtension {
  receiverForm: UseFormReturn<ReceiverFormSchema>
  receiver: Address | undefined
  blockExplorerAddressLink?: string
  enableActions: boolean
}
