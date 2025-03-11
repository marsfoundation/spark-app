import { useSandboxState } from '@/domain/sandbox/useSandboxState'
import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { Token } from '@/domain/types/Token'
import { SimplifiedQueryResult } from '@/utils/types'
import { Hex, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQueries } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

export type UseClaimableRewardsResult = SimplifiedQueryResult<ClaimableReward[]>

export interface ClaimableReward {
  token: Token
  amountToClaim: NormalizedUnitNumber
  cumulativeAmount: NormalizedUnitNumber
  epoch: number
  merkleRoot: Hex
  merkleProof: Hex[]
}

export function useClaimableRewards(): UseClaimableRewardsResult {
  const wagmiConfig = useConfig()
  const chainId = useChainId()
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
      // vpnCheckQueryOptions(),
    ],
    combine: ([rewards]) => {
      if (rewards.isPending) {
        return { isPending: true, isError: false, error: null, data: undefined }
      }

      if (rewards.isError) {
        return { isPending: false, isError: true, error: rewards.error }
      }

      const data = rewards.data
        // In case of vpnCheck error or undefined country code, we are returning all campaigns
        // .filter((reward) => !reward.restrictedCountryCodes.some((code) => code === vpnCheck.data?.countryCode))
        .filter((reward) => reward.chainId === chainId)
        .map(({ rewardToken, cumulativeAmount, epoch, preClaimed, merkleRoot, merkleProof }) => {
          const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))

          return {
            token: rewardToken,
            amountToClaim,
            cumulativeAmount,
            epoch,
            merkleRoot,
            merkleProof,
          }
        })

      return { isPending: false, isError: false, error: null, data }
    },
  })
}
