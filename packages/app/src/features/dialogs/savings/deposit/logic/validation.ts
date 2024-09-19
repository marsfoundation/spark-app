import { TransferAmountValidationIssue } from '@/features/dialogs/common/logic/transfer-amount/validation'

export const depositValidationIssueToMessage: Record<TransferAmountValidationIssue, string> = {
  'value-not-positive': 'Deposit value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
