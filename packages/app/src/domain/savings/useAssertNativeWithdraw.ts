import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { assert } from '@/utils/assert'
import { Address } from 'viem'
import { useMarketInfo } from '../market-info/useMarketInfo'
import { CheckedAddress } from '../types/CheckedAddress'
import { receiverValidationIssueToMessage, validateReceiver } from './validateReceiver'

interface UseAssertNativeWithdrawParams {
  mode: Mode
  receiver: CheckedAddress | undefined
  owner: Address | undefined
}

export function useAssertNativeWithdraw({ mode, receiver, owner }: UseAssertNativeWithdrawParams): void {
  const { marketInfo } = useMarketInfo()

  if (mode === 'withdraw') {
    assert(receiver === undefined, 'Receiver address should not be defined when withdrawing')
  }

  if (mode === 'send' && receiver !== undefined) {
    const validationResult = validateReceiver({
      account: owner ? CheckedAddress(owner) : undefined,
      reserveAddresses: marketInfo.reserves.map((r) => r.token.address),
      receiver,
    })
    assert(validationResult === undefined, receiverValidationIssueToMessage[validationResult!])
  }
}
