import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { useIsSmartContract } from '@/domain/hooks/useIsSmartContract'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
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
  const { receiver, receiverForm, isFormValid } = useReceiverFormValues(marketInfo)
  const blockExplorerAddressLink = useBlockExplorerAddressLink(receiver)
  const { isSmartContract, isPending: isSmartContractCheckPending } = useIsSmartContract(receiver)

  return mode === 'send'
    ? {
        receiverForm,
        receiver,
        blockExplorerAddressLink: isFormValid ? blockExplorerAddressLink : undefined,
        showReceiverIsSmartContractWarning: Boolean(isFormValid && !isSmartContractCheckPending && isSmartContract),
        enableActions: isFormValid && !isSmartContractCheckPending,
      }
    : undefined
}

interface UseDebouncedReceiverFormValuesResult {
  receiverForm: UseFormReturn<ReceiverFormSchema>
  receiver: CheckedAddress | undefined
  isFormValid: boolean
}

function useReceiverFormValues(marketInfo: MarketInfo): UseDebouncedReceiverFormValuesResult {
  const { address: account } = useAccount()

  const receiverForm = useForm<ReceiverFormSchema>({
    resolver: zodResolver(
      getReceiverFormValidator({ account, reserveAddresses: marketInfo.reserves.map((r) => r.token.address) }),
    ),
    defaultValues: { receiver: '' },
    mode: 'onChange',
  })

  const rawReceiver = receiverForm.getValues('receiver')
  const isFormValid = receiverForm.formState.isValid
  const receiver = isFormValid ? CheckedAddress(rawReceiver as Address) : undefined

  return {
    receiverForm,
    receiver,
    isFormValid,
  }
}
