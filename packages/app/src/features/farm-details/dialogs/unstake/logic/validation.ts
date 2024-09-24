import { z } from 'zod'

import { Farm } from '@/domain/farms/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getUnstakeDialogFormValidator(farm: Farm) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const isMaxSelected = field.isMaxSelected
    const usdBalance = farm.stakingToken.toUSD(farm.staked)

    const issue = validateUnstake({
      value,
      isMaxSelected,
      user: { balance: usdBalance },
    })
    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validationIssueToMessage[issue],
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

export function validateUnstake({
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

const validationIssueToMessage: Record<WithdrawValidationIssue, string> = {
  'value-not-positive': 'Unstake value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
