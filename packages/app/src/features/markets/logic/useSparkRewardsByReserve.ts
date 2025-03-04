import { Reserve } from '@/domain/market-info/marketInfo'
import { assignMarketSparkRewards } from '@/domain/spark-rewards/assignMarketSparkRewards'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { MarketSparkRewards } from '../../../domain/spark-rewards/types'

export interface UseSparkRewardsByReserveParams {
  chainId: number
  reserves: Reserve[]
}

export type SparkRewardsByReserve = Record<
  CheckedAddress,
  { borrow: MarketSparkRewards[]; supply: MarketSparkRewards[] }
>

export function useSparkRewardsByReserve({ chainId, reserves }: UseSparkRewardsByReserveParams): SparkRewardsByReserve {
  const wagmiConfig = useConfig()

  const { data } = useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig, chainId }),
    select: (data) =>
      reserves.reduce<SparkRewardsByReserve>((acc, reserve) => {
        acc[reserve.token.address] = {
          supply: assignMarketSparkRewards({
            campaigns: data,
            action: 'supply',
            reserveTokenSymbol: reserve.token.symbol,
          }),
          borrow: assignMarketSparkRewards({
            campaigns: data,
            action: 'borrow',
            reserveTokenSymbol: reserve.token.symbol,
          }),
        }
        return acc
      }, {}),
  })

  return data ?? {}
}
