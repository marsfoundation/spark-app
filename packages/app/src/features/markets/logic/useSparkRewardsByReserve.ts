import { Reserve } from '@/domain/market-info/marketInfo'
import { useSandboxState } from '@/domain/sandbox/useSandboxState'
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
  const { isInSandbox, sandboxChainId } = useSandboxState()

  const { data } = useQuery({
    ...ongoingCampaignsQueryOptions({ wagmiConfig, isInSandbox, sandboxChainId }),
    select: (data) => {
      const campaigns = data.filter((campaign) => campaign.chainId === chainId)
      return reserves.reduce<SparkRewardsByReserve>((acc, reserve) => {
        acc[reserve.token.address] = {
          supply: assignMarketSparkRewards({
            campaigns,
            action: 'supply',
            reserveTokenSymbol: reserve.token.symbol,
          }),
          borrow: assignMarketSparkRewards({
            campaigns,
            action: 'borrow',
            reserveTokenSymbol: reserve.token.symbol,
          }),
        }
        return acc
      }, {})
    },
  })

  return data ?? {}
}
