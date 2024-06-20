import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'

import { aaveDataLayer } from './aave-data-layer/query'
import { MarketInfo, marketInfoSelectFn } from './marketInfo'

export interface UseMarketInfoParams {
  chainId?: number
  timeAdvance?: number
}
export type UseMarketInfoResultOnSuccess = SuspenseQueryWith<{
  marketInfo: MarketInfo
}>

export function useMarketInfo(params: UseMarketInfoParams = {}): UseMarketInfoResultOnSuccess {
  const { address } = useAccount()
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const wagmiConfig = useConfig()

  const res = useSuspenseQuery({
    ...aaveDataLayer({
      wagmiConfig,
      chainId,
      account: address,
    }),
    select: marketInfoSelectFn({ timeAdvance: params.timeAdvance }),
  })

  return {
    ...res,
    marketInfo: res.data,
  }
}
