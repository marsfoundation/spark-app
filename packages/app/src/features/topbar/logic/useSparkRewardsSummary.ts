import { activeRewardsQueryOptions } from '@/domain/spark-rewards/activeRewardsQueryOptions'
import { CheckedAddress, NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SparkRewardsSummary } from '../types'
export interface UseSparkRewardsSummaryParams {
  chainId: number
  address: CheckedAddress | undefined
}

export function useSparkRewardsSummary({ chainId, address }: UseSparkRewardsSummaryParams): SparkRewardsSummary {
  const wagmiConfig = useConfig()

  const { data } = useQuery({
    ...activeRewardsQueryOptions({ wagmiConfig, account: address, chainId }),
    select: (data) => {
      const totalUsdAmount = data.reduce((acc, { rewardToken, cumulativeAmount, preClaimed }) => {
        const amountToClaim = NormalizedUnitNumber(cumulativeAmount.minus(preClaimed))
        return NormalizedUnitNumber(acc.plus(rewardToken.toUSD(amountToClaim)))
      }, NormalizedUnitNumber(0))

      return {
        totalUsdAmount,
      }
    },
  })

  return data ?? {}
}
