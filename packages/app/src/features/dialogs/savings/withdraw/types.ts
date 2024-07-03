import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export type Mode = 'withdraw' | 'send'

export const ReceiverFormSchema = z.object({
  receiver: z.string(),
})
export type ReceiverFormSchema = z.infer<typeof ReceiverFormSchema>

export interface SendModeExtension {
  receiverForm: UseFormReturn<ReceiverFormSchema>
  receiver: CheckedAddress | undefined
  showReceiverIsSmartContractWarning: boolean
  blockExplorerAddressLink?: string
  enableActions: boolean
}
