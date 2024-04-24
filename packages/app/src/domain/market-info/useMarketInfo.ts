import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { getNativeAssetInfo } from '@/config/chain/utils/getNativeAssetInfo'
import { SuspenseQueryWith } from '@/utils/types'

import { aaveDataLayer } from './aave-data-layer/query'
import { MarketInfo, marketInfo } from './marketInfo'

export interface UseMarketInfoParams {
  chainId?: number
}
export type UseMarketInfoResultOnSuccess = SuspenseQueryWith<{
  marketInfo: MarketInfo
}>

export function useMarketInfo(params: UseMarketInfoParams = {}): UseMarketInfoResultOnSuccess {
  const { address } = useAccount()
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const wagmiConfig = useConfig()
  const nativeAssetInfo = getNativeAssetInfo(chainId)

  const res = useSuspenseQuery({
    ...aaveDataLayer({
      wagmiConfig,
      chainId,
      account: address,
    }),
    select: (aaveData) => marketInfo(aaveData, nativeAssetInfo, chainId),
  })

  return {
    ...res,
    marketInfo: res.data,
  }
}
