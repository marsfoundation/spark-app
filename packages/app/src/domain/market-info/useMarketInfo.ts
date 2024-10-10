import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'

import { useMemo } from 'react'
import { aaveDataLayer } from './aave-data-layer/query'
import { MarketInfo, marketInfoSelectFn } from './marketInfo'

export interface UseMarketInfoParams {
  chainId: number
  timeAdvance?: number
}
export type UseMarketInfoResultOnSuccess = SuspenseQueryWith<{
  marketInfo: MarketInfo
}>

export function useMarketInfo({ chainId, timeAdvance }: UseMarketInfoParams): UseMarketInfoResultOnSuccess {
  const { address } = useAccount()
  const wagmiConfig = useConfig()

  const res = useSuspenseQuery({
    ...aaveDataLayer({
      wagmiConfig,
      chainId,
      account: address,
    }),
    select: useMemo(() => marketInfoSelectFn({ timeAdvance }), [timeAdvance]),
  })

  return {
    ...res,
    marketInfo: res.data,
  }
}
