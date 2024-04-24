import { z } from 'zod'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getSavingsDepositDialogFormValidator(walletInfo: WalletInfo) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const balance = walletInfo.findWalletBalanceForSymbol(field.symbol)

    const issue = validateDeposit({
      value,
      user: { balance },
    })
    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: depositValidationIssueToMessage[issue],
        path: ['value'],
      })
    }
  })
}

export type DepositValidationIssue = 'exceeds-balance' | 'value-not-positive'

export interface ValidateDepositArgs {
  value: NormalizedUnitNumber
  user: {
    balance: NormalizedUnitNumber
  }
}

export function validateDeposit({ value, user: { balance } }: ValidateDepositArgs): DepositValidationIssue | undefined {
  if (value.isLessThanOrEqualTo(0)) {
    return 'value-not-positive'
  }

  if (balance.lt(value)) {
    return 'exceeds-balance'
  }
}

export const depositValidationIssueToMessage: Record<DepositValidationIssue, string> = {
  'value-not-positive': 'Deposit value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
