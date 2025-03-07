import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { SimplifiedQueryResult } from '@/utils/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { pipe, sumBy } from 'remeda'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { ClaimableReward } from '../types'

export type UseClaimableRewardsSummaryResult = SimplifiedQueryResult<ClaimableRewardsSummary>

export interface ClaimableRewardsSummary {
  usdSum: NormalizedUnitNumber
  isClaimEnabled: boolean
  claimableRewardsWithPrice: ClaimableReward[]
  claimableRewardsWithoutPrice: ClaimableReward[]
  chainId: number
  claimAll: () => void
}

export function useClaimableRewardsSummary(): UseClaimableRewardsSummaryResult {
  const wagmiConfig = useConfig()
  const chainId = useChainId()
  const { address: account } = useAccount()
  const { isInSandbox, sandboxChainId } = useSandboxState()

  return useQuery({
    ...claimableRewardsQueryOptions({ wagmiConfig, account, isInSandbox, sandboxChainId }),
    select: (data) => {
      const claimableRewards = data
        .filter((reward) => reward.chainId === chainId)
        .map(({ rewardToken, cumulativeAmount, pendingAmount, preClaimed, chainId }) => {
          const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))
          return {
            token: rewardToken,
            amountPending: pendingAmount,
            amountToClaim,
            chainId,
          }
        })

      const claimableRewardsWithPrice = claimableRewards.filter(({ token, amountToClaim }) =>
        token.toUSD(amountToClaim).isGreaterThan(0),
      )
      const usdSum = pipe(
        claimableRewardsWithPrice,
        sumBy(({ token, amountToClaim }) => token.toUSD(amountToClaim).toNumber()),
        NormalizedUnitNumber,
      )

      const isClaimEnabled = pipe(
        claimableRewards,
        sumBy(({ amountToClaim }) => amountToClaim.toNumber()),
        Boolean,
      )

      const claimableRewardsWithoutPrice = claimableRewards.filter(
        ({ token, amountToClaim }) => amountToClaim.isGreaterThan(0) && token.toUSD(amountToClaim).isEqualTo(0),
      )

      return {
        usdSum,
        isClaimEnabled,
        claimableRewardsWithPrice,
        claimableRewardsWithoutPrice,
        chainId: chainId,
        claimAll: () => {},
      }
    },
  })
}
