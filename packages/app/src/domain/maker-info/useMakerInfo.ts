import { useSuspenseQuery } from '@tanstack/react-query'
import { useChainId, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'

import { makerInfoQuery } from './makerInfoQuery'
import { MakerInfo } from './types'

interface UseMakerInfoParams {
  chainId?: number
}

type UseMakerInfoResult = SuspenseQueryWith<{
  makerInfo: MakerInfo | undefined
}>

export function useMakerInfo(params: UseMakerInfoParams = {}): UseMakerInfoResult {
  const currentChainId = useChainId()
  const chainId = params.chainId ?? currentChainId
  const wagmiConfig = useConfig()

  const result = useSuspenseQuery(makerInfoQuery({ wagmiConfig, chainId }))

  return {
    ...result,
    makerInfo: result.data ?? undefined,
  }
}
