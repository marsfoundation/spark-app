import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { useDebounce } from '@/utils/useDebounce'
import { UseFormReturn, useForm } from 'react-hook-form'
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
  receiver: CheckedAddress | undefined
  isFormValid: boolean
  isDebouncing: boolean
}

function useDebouncedReceiverFormValues(): UseDebouncedReceiverFormValuesResult {
  const receiverForm = useForm<ReceiverFormSchema>({
    mode: 'onChange',
  })

  const rawReceiver = receiverForm.watch('receiver')
  const { debouncedValue, isDebouncing } = useDebounce({ receiverForm, rawReceiver }, rawReceiver)
  const isFormValid = debouncedValue.receiverForm.formState.isValid
  // @todo: Temporary, Needs proper validation of the form to cast to Address here
  const receiver = isFormValid ? (debouncedValue.rawReceiver as CheckedAddress) : undefined

  return {
    receiverForm: debouncedValue.receiverForm,
    receiver,
    isFormValid,
    isDebouncing,
  }
}
