import { Alert } from '@/features/dialogs/common/components/alert/Alert'
import { RewardPointsSyncStatus } from '@/features/farm-details/types'
import { assertNever } from '@/utils/assertNever'

export interface RewardPointsSyncWarningProps {
  status: RewardPointsSyncStatus
}

export function RewardPointsSyncWarning({ status }: RewardPointsSyncWarningProps) {
  switch (status) {
    case 'synced':
      return null
    case 'out-of-sync':
      return (
        <Alert variant="warning" size="small">
          Reward points data is out of sync. Please wait.
        </Alert>
      )
    case 'sync-failed':
      return (
        <Alert variant="danger" size="small">
          Reward points data could not be synced.
        </Alert>
      )
    default:
      assertNever(status)
  }
}
