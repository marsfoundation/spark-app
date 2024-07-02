import { z } from 'zod'

import { TokenWithBalance } from '@/domain/common/types'
import { receiverValidationIssueToMessage, validateReceiver } from '@/domain/savings/validateReceiver'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { Address } from 'viem'
import { ReceiverFormSchema } from '../types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getSavingsWithdrawDialogFormValidator(sDaiBalance: TokenWithBalance) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const isMaxSelected = field.isMaxSelected
    const usdBalance = sDaiBalance.token.toUSD(sDaiBalance.balance)

    const issue = validateWithdraw({
      value,
      isMaxSelected,
      user: { balance: usdBalance },
    })
    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: withdrawValidationIssueToMessage[issue],
        path: ['value'],
      })
    }
  })
}

export type WithdrawValidationIssue = 'exceeds-balance' | 'value-not-positive'

export interface ValidateWithdrawArgs {
  value: NormalizedUnitNumber
  isMaxSelected: boolean
  user: {
    balance: NormalizedUnitNumber
  }
}

export function validateWithdraw({
  value,
  isMaxSelected,
  user: { balance },
}: ValidateWithdrawArgs): WithdrawValidationIssue | undefined {
  if (isMaxSelected) {
    return undefined
  }

  if (value.isLessThanOrEqualTo(0)) {
    return 'value-not-positive'
  }

  if (balance.lt(value)) {
    return 'exceeds-balance'
  }
}

export const withdrawValidationIssueToMessage: Record<WithdrawValidationIssue, string> = {
  'value-not-positive': 'Withdraw value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}

export interface getReceiverFormValidatorParams {
  account: Address | undefined
  reserveAddresses: CheckedAddress[]
}

export function getReceiverFormValidator({ account, reserveAddresses }: getReceiverFormValidatorParams) {
  return ReceiverFormSchema.superRefine((field, ctx) => {
    const receiver = field.receiver
    const issue = validateReceiver({
      account: account ? CheckedAddress(account) : undefined,
      reserveAddresses,
      receiver,
    })

    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: receiverValidationIssueToMessage[issue],
        path: ['receiver'],
      })
    }
  })
}
