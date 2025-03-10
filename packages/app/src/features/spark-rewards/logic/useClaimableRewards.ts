import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { useOpenDialog } from '@/domain/state/dialogs'
import { claimSparkRewardsDialogConfig } from '@/features/dialogs/claim-spark-rewards/ClaimSparkRewardsDialog'
import { SimplifiedQueryResult } from '@/utils/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig, useSwitchChain } from 'wagmi'
import { ClaimableReward } from '../types'

export type UseClaimableRewardsResult = SimplifiedQueryResult<ClaimableRewardWithAction[]>
export interface ClaimableRewardWithAction extends ClaimableReward {
  actionName: string
  action: () => void
  isActionEnabled: boolean
}

export function useClaimableRewards(): UseClaimableRewardsResult {
  const wagmiConfig = useConfig()
  const openDialog = useOpenDialog()
  const { switchChain } = useSwitchChain()
  const connectedChainId = useChainId()
  const { address: account } = useAccount()
  const { isInSandbox, sandboxChainId } = useSandboxState()

  return useQuery({
    ...claimableRewardsQueryOptions({ wagmiConfig, account, isInSandbox, sandboxChainId }),
    select: (data) =>
      data.map(({ rewardToken, cumulativeAmount, pendingAmount, preClaimed, chainId }) => {
        const isConnectedChainReward = chainId === connectedChainId
        const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))
        return {
          token: rewardToken,
          amountPending: pendingAmount,
          amountToClaim,
          chainId,
          actionName: isConnectedChainReward ? 'Claim' : 'Switch',
          isActionEnabled: (isConnectedChainReward && amountToClaim.gt(0)) || !isConnectedChainReward,
          action: isConnectedChainReward
            ? () =>
                openDialog(claimSparkRewardsDialogConfig, {
                  tokensToClaim: [rewardToken],
                })
            : () => switchChain({ chainId }),
        }
      }),
  })
}
