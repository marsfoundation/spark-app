import { TransferAmountValidationIssue } from '@/features/dialogs/common/logic/transfer-amount/validation'

export const validationIssueToMessage: Record<TransferAmountValidationIssue, string> = {
  'value-not-positive': 'Stake value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
