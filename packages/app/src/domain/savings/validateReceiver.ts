import { isAddress, zeroAddress } from 'viem'
import { CheckedAddress } from '../types/CheckedAddress'

export type ReceiverValidationIssue =
  | 'undefined-receiver'
  | 'invalid-address'
  | 'zero-address'
  | 'reserve-address'
  | 'self-address'

export interface ValidateReceiverParams {
  account: CheckedAddress | undefined
  reserveAddresses: CheckedAddress[]
  receiver: string | undefined
}

export function validateReceiver({
  account,
  reserveAddresses,
  receiver,
}: ValidateReceiverParams): ReceiverValidationIssue | undefined {
  if (!account) {
    return undefined
  }

  if (receiver === undefined || receiver === '') {
    return 'undefined-receiver'
  }

  if (!isAddress(receiver, { strict: false })) {
    return 'invalid-address'
  }

  if (receiver === CheckedAddress(zeroAddress)) {
    return 'zero-address'
  }

  if (reserveAddresses.includes(receiver)) {
    return 'reserve-address'
  }

  if (account === receiver) {
    return 'self-address'
  }
}

export const receiverValidationIssueToMessage: Record<ReceiverValidationIssue, string> = {
  'undefined-receiver': 'Receiver address should be provided',
  'invalid-address': 'Invalid receiver address',
  'zero-address': 'Receiver address is zero address',
  'reserve-address': 'Receiver address is a token address',
  'self-address': 'Receiver address is the same as the sender',
}
