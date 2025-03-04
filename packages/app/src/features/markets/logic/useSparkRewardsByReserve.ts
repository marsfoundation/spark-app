import { Reserve } from '@/domain/market-info/marketInfo'
import { assignSparkRewards } from '@/domain/spark-rewards/assignSparkRewards'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { SparkReward } from '../../../domain/spark-rewards/types'

export interface UseSparkRewardsByReserveParams {
  chainId: number
  reserves: Reserve[]
}

export type SparkRewardsByReserve = Record<CheckedAddress, { borrow: SparkReward[]; supply: SparkReward[] }>

export function useSparkRewardsByReserve({ chainId, reserves }: UseSparkRewardsByReserveParams): SparkRewardsByReserve {
  const wagmiConfig = useConfig()

  const { data } = useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig, chainId }),
    select: (data) =>
      reserves.reduce<SparkRewardsByReserve>((acc, reserve) => {
        acc[reserve.token.address] = {
          supply: assignSparkRewards({ campaigns: data, action: 'supply', reserveTokenSymbol: reserve.token.symbol }),
          borrow: assignSparkRewards({ campaigns: data, action: 'borrow', reserveTokenSymbol: reserve.token.symbol }),
        }
        return acc
      }, {}),
  })

  return data ?? {}
}
