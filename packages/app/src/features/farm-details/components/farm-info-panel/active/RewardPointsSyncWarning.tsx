import { Alert } from '@/features/dialogs/common/components/alert/Alert'
import { RewardPointsSyncStatus } from '@/features/farm-details/types'
import { assertNever } from '@/utils/assertNever'

export interface RewardPointsSyncWarningProps {
  status: RewardPointsSyncStatus
  'data-testid'?: string
}

export function RewardPointsSyncWarning({ status, ...rest }: RewardPointsSyncWarningProps) {
  switch (status) {
    case 'synced':
      return null
    case 'out-of-sync':
      return (
        <Alert variant="warning" size="small" {...rest}>
          Points data is out of sync. Please wait.
        </Alert>
      )
    case 'sync-failed':
      return (
        <Alert variant="danger" size="small" {...rest}>
          Points data could not be synced.
        </Alert>
      )
    default:
      assertNever(status)
  }
}
