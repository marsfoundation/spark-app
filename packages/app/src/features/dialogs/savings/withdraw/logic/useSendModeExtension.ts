import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { UseFormReturn } from 'react-hook-form'
import { Mode, ReceiverFormSchema, SendModeExtension } from '../types'

export interface UseSendModeOptionsParams {
  mode: Mode
  receiverForm: UseFormReturn<ReceiverFormSchema>
}

export function useSendModeExtension({ mode, receiverForm }: UseSendModeOptionsParams): SendModeExtension | undefined {
  const receiver = receiverForm.watch('receiver')
  const isFormValid = receiverForm.formState.isValid
  const blockExplorerAddressLink = useBlockExplorerAddressLink(receiver)

  return mode === 'send'
    ? {
        receiverForm,
        receiver,
        blockExplorerAddressLink: isFormValid ? blockExplorerAddressLink : undefined,
      }
    : undefined
}
