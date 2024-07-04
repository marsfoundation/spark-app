import { Mode } from '@/features/dialogs/savings/withdraw/types'
import { assert } from '@/utils/assert'
import { Address } from 'viem'
import { CheckedAddress } from '../types/CheckedAddress'
import { receiverValidationIssueToMessage, validateReceiver } from './validateReceiver'

interface AssertNativeWithdrawParams {
  mode: Mode
  owner: Address | undefined
  receiver?: CheckedAddress
  reserveAddresses?: CheckedAddress[]
}

export function assertNativeWithdraw({ mode, receiver, owner, reserveAddresses }: AssertNativeWithdrawParams): void {
  if (mode === 'withdraw') {
    assert(receiver === undefined, 'Receiver address should not be defined when withdrawing')
    assert(reserveAddresses === undefined, 'Reserve addresses should not be defined when withdrawing')
  }

  if (mode === 'send' && receiver !== undefined) {
    assert(reserveAddresses !== undefined, 'Reserve addresses should be defined when sending')
    const validationResult = validateReceiver({
      account: owner ? CheckedAddress(owner) : undefined,
      reserveAddresses,
      receiver,
    })
    assert(validationResult === undefined, receiverValidationIssueToMessage[validationResult!])
  }
}
