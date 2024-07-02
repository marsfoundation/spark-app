import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { useDebounce } from '@/utils/useDebounce'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormReturn, useForm } from 'react-hook-form'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { Mode, ReceiverFormSchema, SendModeExtension } from '../types'
import { getReceiverFormValidator } from './validation'

export interface UseSendModeOptionsParams {
  mode: Mode
  marketInfo: MarketInfo
}

export function useSendModeExtension({ mode, marketInfo }: UseSendModeOptionsParams): SendModeExtension | undefined {
  const { receiver, receiverForm, isFormValid, isDebouncing } = useDebouncedReceiverFormValues(marketInfo)
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

function useDebouncedReceiverFormValues(marketInfo: MarketInfo): UseDebouncedReceiverFormValuesResult {
  const { address: account } = useAccount()

  const receiverForm = useForm<ReceiverFormSchema>({
    resolver: zodResolver(
      getReceiverFormValidator({ account, reserveAddresses: marketInfo.reserves.map((r) => r.token.address) }),
    ),
    defaultValues: { receiver: '' },
    mode: 'onChange',
  })

  const rawReceiver = receiverForm.watch('receiver')
  const { debouncedValue, isDebouncing } = useDebounce({ receiverForm, rawReceiver }, rawReceiver)
  const isFormValid = debouncedValue.receiverForm.formState.isValid
  const receiver = isFormValid && !isDebouncing ? CheckedAddress(debouncedValue.rawReceiver as Address) : undefined

  return {
    receiverForm: debouncedValue.receiverForm,
    receiver,
    isFormValid,
    isDebouncing,
  }
}
