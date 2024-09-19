import { TransferFromUserValidationIssue } from '@/features/dialogs/common/logic/transfer-from-user/validation'

export const depositValidationIssueToMessage: Record<TransferFromUserValidationIssue, string> = {
  'value-not-positive': 'Deposit value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
