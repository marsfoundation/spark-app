import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { Token } from '@/domain/types/Token'
import { SimplifiedQueryResult } from '@/utils/types'
import { Hex, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
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

  return useQuery({
    ...claimableRewardsQueryOptions({ wagmiConfig, account }),
    select: (data) =>
      data
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
        }),
  })
}
