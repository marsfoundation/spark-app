import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { UseFormReturn } from 'react-hook-form'
import { Mode, ReceiverFormSchema, SendModeOptions } from '../types'

export interface UseSendModeOptionsParams {
  mode: Mode
  receiverForm: UseFormReturn<ReceiverFormSchema>
}

export function useSendModeOptions({ mode, receiverForm }: UseSendModeOptionsParams): SendModeOptions | undefined {
  const receiver = receiverForm.watch('receiver')
  const blockExplorerAddressLink = useBlockExplorerAddressLink(receiver)

  return mode === 'send' ? { isSendMode: true, receiverForm, receiver, blockExplorerAddressLink } : undefined
}
