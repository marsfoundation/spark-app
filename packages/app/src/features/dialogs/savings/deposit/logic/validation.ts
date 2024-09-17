import { BalanceValidationIssue } from '@/features/dialogs/common/logic/asset-balance/validation'

export const depositValidationIssueToMessage: Record<BalanceValidationIssue, string> = {
  'value-not-positive': 'Deposit value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
