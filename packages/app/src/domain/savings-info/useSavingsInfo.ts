import { useSuspenseQuery } from '@tanstack/react-query'
import { gnosis, mainnet } from 'viem/chains'
import { Config, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'

import { useOriginChainId } from '../hooks/useOriginChainId'
import { gnosisSavingsInfo } from './gnosisSavingsInfo'
import { mainnetSavingsInfo } from './mainnetSavingsInfo'
import { SavingsManager } from './types'

export type UseSavingsInfoResult = SuspenseQueryWith<{
  savingsManager: SavingsManager
}>

export function useSavingsInfo(): UseSavingsInfoResult {
  const chainId = useOriginChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()

  const queryOptions = getSavingsInfoQueryOptions({
    wagmiConfig,
    chainId,
    timestamp,
  })
  const result = useSuspenseQuery(queryOptions)

  return {
    ...result,
    savingsManager: result.data,
  }
}

export interface GetSavingsInfoQueryOptionsParams {
  wagmiConfig: Config
  chainId: number
  timestamp: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getSavingsInfoQueryOptions({ wagmiConfig, chainId, timestamp }: GetSavingsInfoQueryOptionsParams) {
  if (chainId === mainnet.id) {
    return mainnetSavingsInfo({ wagmiConfig, timestamp })
  }
  if (chainId === gnosis.id) {
    return gnosisSavingsInfo({ wagmiConfig, timestamp })
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}
