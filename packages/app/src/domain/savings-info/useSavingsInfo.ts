import { useSuspenseQuery } from '@tanstack/react-query'
import { gnosis, mainnet } from 'viem/chains'
import { Config, useConfig } from 'wagmi'

import { SuspenseQueryWith } from '@/utils/types'
import { useTimestamp } from '@/utils/useTimestamp'

import { useOriginChainId } from '../hooks/useOriginChainId'
import { gnosisSavingsInfoQuery } from './gnosisSavingsInfo'
import { mainnetSavingsInfoQuery } from './mainnetSavingsInfo'
import { SavingsInfo } from './types'

export type UseSavingsInfoResult = SuspenseQueryWith<{
  savingsInfo: SavingsInfo
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
    savingsInfo: result.data,
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
    return mainnetSavingsInfoQuery({ wagmiConfig, timestamp })
  }
  if (chainId === gnosis.id) {
    return gnosisSavingsInfoQuery({ wagmiConfig, timestamp })
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}
