import { z } from 'zod'

import { TokenWithBalance } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'

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
