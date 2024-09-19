import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { z } from 'zod'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getTransferAmountFormValidator(
  tokensInfo: TokensInfo,
  issueToMessage: Record<TransferAmountValidationIssue, string>,
) {
  return AssetInputSchema.superRefine((field, ctx) => {
    const value = NormalizedUnitNumber(field.value === '' ? '0' : field.value)
    const balance = tokensInfo.findOneBalanceBySymbol(field.symbol)

    const issue = validateTransferAmount({
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

export type TransferAmountValidationIssue = 'exceeds-balance' | 'value-not-positive'

export interface ValidateBalanceArgs {
  value: NormalizedUnitNumber
  user: {
    balance: NormalizedUnitNumber
  }
}

export function validateTransferAmount({
  value,
  user: { balance },
}: ValidateBalanceArgs): TransferAmountValidationIssue | undefined {
  if (value.isLessThanOrEqualTo(0)) {
    return 'value-not-positive'
  }

  if (balance.lt(value)) {
    return 'exceeds-balance'
  }
}
