import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import {
  TransferFromUserValidationIssue,
  validateTransferFromUser,
} from '@/features/dialogs/common/logic/transfer-from-user/validation'
import { z } from 'zod'
import { ConvertStablesFormSchema } from './schema'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getConvertStablesFormValidator(tokensInfo: TokensInfo) {
  return ConvertStablesFormSchema.superRefine((field, ctx) => {
    const amount = NormalizedUnitNumber(field.amount === '' ? '0' : field.amount)
    const balance = tokensInfo.findOneBalanceBySymbol(field.symbolFrom)

    const issue = validateTransferFromUser({
      value: amount,
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

const issueToMessage: Record<TransferFromUserValidationIssue, string> = {
  'value-not-positive': 'From amount should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
