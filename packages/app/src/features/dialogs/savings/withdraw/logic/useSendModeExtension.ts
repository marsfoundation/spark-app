import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { useDebounce } from '@/utils/useDebounce'
import { UseFormReturn, useForm } from 'react-hook-form'
import { Address } from 'viem'
import { Mode, ReceiverFormSchema, SendModeExtension } from '../types'

export interface UseSendModeOptionsParams {
  mode: Mode
}

export function useSendModeExtension({ mode }: UseSendModeOptionsParams): SendModeExtension | undefined {
  const { receiver, receiverForm, isFormValid, isDebouncing } = useDebouncedReceiverFormValues()
  const blockExplorerAddressLink = useBlockExplorerAddressLink(receiver)

  return mode === 'send'
    ? {
        receiverForm,
        receiver,
        blockExplorerAddressLink: isFormValid ? blockExplorerAddressLink : undefined,
        enableActions: !isDebouncing && isFormValid,
      }
    : undefined
}

interface UseDebouncedReceiverFormValuesResult {
  receiverForm: UseFormReturn<ReceiverFormSchema>
  receiver: Address
  isFormValid: boolean
  isDebouncing: boolean
}

function useDebouncedReceiverFormValues(): UseDebouncedReceiverFormValuesResult {
  const receiverForm = useForm<ReceiverFormSchema>({
    mode: 'onChange',
  })
  const receiver = receiverForm.watch('receiver')
  const { debouncedValue, isDebouncing } = useDebounce({ receiverForm, receiver }, receiver)
  const isFormValid = debouncedValue.receiverForm.formState.isValid

  return {
    receiverForm: debouncedValue.receiverForm,
    receiver: debouncedValue.receiver,
    isFormValid,
    isDebouncing,
  }
}
