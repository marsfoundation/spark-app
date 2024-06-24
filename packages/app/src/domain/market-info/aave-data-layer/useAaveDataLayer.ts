import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'

import { useMemo } from 'react'
import { AaveData, aaveDataLayer, aaveDataLayerSelectFn } from './query'

export interface UseAaveDataLayerParams {
  chainId?: number
}
export type UseAaveDataLayerResultOnSuccess = SuspenseQueryWith<{
  aaveData: AaveData
}>

export function useAaveDataLayer(params: UseAaveDataLayerParams = {}): UseAaveDataLayerResultOnSuccess {
  const { address } = useAccount()
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const wagmiConfig = useConfig()

  const result = useSuspenseQuery({
    ...aaveDataLayer({
      wagmiConfig,
      chainId,
      account: address,
    }),
    select: useMemo(() => aaveDataLayerSelectFn(), []),
  })

  return {
    ...result,
    aaveData: result.data,
  }
}
