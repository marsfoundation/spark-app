import { useBlockExplorerAddressLink } from '@/domain/hooks/useBlockExplorerAddressLink'
import { useIsSmartContract } from '@/domain/hooks/useIsSmartContract'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormReturn, useForm } from 'react-hook-form'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { Mode, ReceiverFormSchema, SendModeExtension } from '../types'
import { getReceiverFormValidator } from './validation'

export interface UseSendModeOptionsParams {
  mode: Mode
  tokensInfo: TokensInfo
}

export function useSendModeExtension({ mode, tokensInfo }: UseSendModeOptionsParams): SendModeExtension | undefined {
  const { receiver, receiverForm, isFormValid } = useReceiverFormValues(tokensInfo)
  const blockExplorerAddressLink = useBlockExplorerAddressLink({ address: receiver })
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

function useReceiverFormValues(tokensInfo: TokensInfo): UseDebouncedReceiverFormValuesResult {
  const { address: account } = useAccount()

  const receiverForm = useForm<ReceiverFormSchema>({
    resolver: zodResolver(
      getReceiverFormValidator({ account, tokenAddresses: tokensInfo.all().map((r) => r.token.address) }),
    ),
    defaultValues: { receiver: '' },
    mode: 'onChange',
  })

  const rawReceiver = receiverForm.watch('receiver')
  const isFormValid = !receiverForm.formState.isValidating && receiverForm.formState.isValid
  const receiver = isFormValid ? CheckedAddress(rawReceiver as Address) : undefined

  return {
    receiverForm,
    receiver,
    isFormValid,
  }
}
