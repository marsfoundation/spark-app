import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { useOpenDialog } from '@/domain/state/dialogs'
import { vpnCheckQueryOptions } from '@/features/compliance/logic/vpnCheckQueryOptions'
import { claimSparkRewardsDialogConfig } from '@/features/dialogs/claim-spark-rewards/ClaimSparkRewardsDialog'
import { SimplifiedQueryResult } from '@/utils/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQueries } from '@tanstack/react-query'
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

  return useQueries({
    queries: [
      claimableRewardsQueryOptions({
        wagmiConfig,
        account,
        isInSandbox,
        sandboxChainId,
      }),
      vpnCheckQueryOptions(),
    ],
    combine: ([rewards, vpnCheck]) => {
      if (rewards.isPending || vpnCheck.isPending) {
        return { isPending: true, isError: false, error: null, data: undefined }
      }

      if (rewards.isError) {
        return { isPending: false, isError: true, error: rewards.error }
      }

      const data = rewards.data
        .filter((reward) => !reward.restrictedCountryCodes.some((code) => code === vpnCheck.data?.countryCode))
        .map(({ rewardToken, cumulativeAmount, pendingAmount, preClaimed, chainId }) => {
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
        })

      return { isPending: false, isError: false, error: null, data }
    },
  })
}
