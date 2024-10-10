import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'

import { useMemo } from 'react'
import { AaveData, aaveDataLayer, aaveDataLayerSelectFn } from './query'

export interface UseAaveDataLayerParams {
  chainId: number
}
export type UseAaveDataLayerResultOnSuccess = SuspenseQueryWith<{
  aaveData: AaveData
}>

export function useAaveDataLayer({ chainId }: UseAaveDataLayerParams): UseAaveDataLayerResultOnSuccess {
  const { address } = useAccount()
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
