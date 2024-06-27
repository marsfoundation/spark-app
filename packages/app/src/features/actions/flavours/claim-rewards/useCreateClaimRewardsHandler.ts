import { useClaimAllRewards } from '@/domain/rewards/useClaimAllRewards'
import { ActionHandler } from '../../logic/types'
import { mapWriteResultToActionState } from '../../logic/utils'
import { ClaimRewardsAction } from './types'

export interface UseCreateClaimRewardsHandlerOptions {
  enabled: boolean
  onFinish?: () => void
}

export function useCreateClaimRewardsHandler(
  action: ClaimRewardsAction,
  options: UseCreateClaimRewardsHandlerOptions,
): ActionHandler {
  const { enabled, onFinish } = options

  const claim = useClaimAllRewards({
    assets: action.assets,
    incentiveControllerAddress: action.incentiveControllerAddress,
    enabled,
    onTransactionSettled: onFinish,
  })

  return {
    action,
    state: mapWriteResultToActionState(claim),
    onAction: claim.write,
  }
}
