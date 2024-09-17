import { BalanceValidationIssue } from '@/features/dialogs/common/logic/asset-balance/validation'

export const validationIssueToMessage: Record<BalanceValidationIssue, string> = {
  'value-not-positive': 'Stake value should be positive',
  'exceeds-balance': 'Exceeds your balance',
}
