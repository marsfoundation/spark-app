import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getTokenWithBalanceFormValidator(
  tokensInfo: TokensInfo,
  issueToMessage: Record<BalanceValidationIssue, string>,
) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const balance = tokensInfo.findOneBalanceBySymbol(field.symbol)

    const issue = validateBalance({
      value,
      user: { balance },
    })
    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: issueToMessage[issue],
        path: ['value'],
      })
    }
  })
}

export type BalanceValidationIssue = 'exceeds-balance' | 'value-not-positive'

export interface ValidateBalanceArgs {
  value: NormalizedUnitNumber
  user: {
    balance: NormalizedUnitNumber
  }
}

export function validateBalance({ value, user: { balance } }: ValidateBalanceArgs): BalanceValidationIssue | undefined {
  if (value.isLessThanOrEqualTo(0)) {
    return 'value-not-positive'
  }

  if (balance.lt(value)) {
    return 'exceeds-balance'
  }
}
