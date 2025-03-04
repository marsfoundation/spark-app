import { Reserve } from '@/domain/market-info/marketInfo'
import { assignSparkRewards } from '@/domain/spark-rewards/assignSparkRewards'
import { ongoingCampaignsQueryOptions } from '@/domain/spark-rewards/ongoingCampaignsQueryOptions'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { useQuery } from '@tanstack/react-query'
import { mapToObj } from 'remeda'
import { useConfig } from 'wagmi'
import { SparkReward } from '../../../domain/spark-rewards/types'

export interface UseSparkRewardsByReserveParams {
  chainId: number
  reserves: Reserve[]
}

export type SparkRewardsByReserve = Record<TokenSymbol, { borrow: SparkReward[]; supply: SparkReward[] }>

export function useSparkRewardsByReserve({ chainId, reserves }: UseSparkRewardsByReserveParams): SparkRewardsByReserve {
  const wagmiConfig = useConfig()
  const reservesTokenSymbols = reserves.map((reserve) => reserve.token.symbol)

  const { data } = useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig, chainId }),
    select: (data) =>
      mapToObj(reservesTokenSymbols, (reserveTokenSymbol) => [
        reserveTokenSymbol,
        {
          supply: assignSparkRewards({ campaigns: data, action: 'supply', reserveTokenSymbol }),
          borrow: assignSparkRewards({ campaigns: data, action: 'borrow', reserveTokenSymbol }),
        },
      ]),
  })

  return data ?? {}
}
