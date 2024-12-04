import { TokensInfo } from '@/domain/wallet/useTokens/TokenInfo'
import {
  TransferFromUserValidationIssue,
  validateTransferFromUser,
} from '@/features/dialogs/common/logic/transfer-from-user/validation'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { z } from 'zod'
import { ConvertStablesFormSchema } from './schema'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getConvertStablesFormValidator(tokensInfo: TokensInfo) {
  return ConvertStablesFormSchema.superRefine((field, ctx) => {
    const amount = NormalizedUnitNumber(field.amount === '' ? '0' : field.amount)
    const balance = tokensInfo.findOneBalanceBySymbol(field.inTokenSymbol)

    const issue = validateTransferFromUser({
      value: amount,
      user: { balance },
    })
    if (issue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: issueToMessage[issue],
        path: ['amount'],
      })
    }
  })
}

const issueToMessage: Record<TransferFromUserValidationIssue, string> = {
  'value-not-positive': 'Amount should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
