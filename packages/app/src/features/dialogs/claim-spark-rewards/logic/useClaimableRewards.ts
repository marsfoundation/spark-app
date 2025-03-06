import { claimableRewardsQueryOptions } from '@/domain/spark-rewards/claimableRewardsQueryOptions'
import { Token } from '@/domain/types/Token'
import { SimplifiedQueryResult } from '@/utils/types'
import { Hex, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'

export interface ClaimableRewardsParams {
  account?: Address
  chainId: number
}

export type ClaimableRewardsResult = SimplifiedQueryResult<ClaimableReward[]>

export interface ClaimableReward {
  token: Token
  amountToClaim: NormalizedUnitNumber
  cumulativeAmount: NormalizedUnitNumber
  epoch: number
  merkleRoot: Hex
  merkleProof: Hex[]
}

export function useClaimableRewards({ account, chainId }: ClaimableRewardsParams): ClaimableRewardsResult {
  const wagmiConfig = useConfig()

  return useQuery({
    ...claimableRewardsQueryOptions({ wagmiConfig, account, chainId }),
    select: (data) =>
      data.map(({ rewardToken, cumulativeAmount, epoch, preClaimed, merkleRoot, merkleProof }) => {
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
