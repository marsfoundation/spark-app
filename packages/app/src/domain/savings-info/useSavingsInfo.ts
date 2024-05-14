import { useSuspenseQuery } from '@tanstack/react-query'
import { Config, useConfig } from 'wagmi'

import { mainnetSavingsInfo } from './mainnetSavingsInfo'
import { gnosisSavingsInfo } from './gnosisSavingsInfo'
import { gnosis, mainnet } from 'viem/chains'
import { useOriginChainId } from '../hooks/useOriginChainId'
import { useTimestamp } from '@/utils/useTimestamp'

export function useSavingsInfo() {
  const chainId = useOriginChainId()
  const wagmiConfig = useConfig()
  const { timestamp } = useTimestamp()

  const queryOptions = getSavingsInfoQueryOptions(wagmiConfig, chainId, timestamp)
  const result = useSuspenseQuery(queryOptions)

  return {}
}

function getSavingsInfoQueryOptions(wagmiConfig: Config, chainId: number, timestamp: number) {
  if (chainId === mainnet.id) {
    return mainnetSavingsInfo({ wagmiConfig })
  }
  if (chainId === gnosis.id) {
    return gnosisSavingsInfo({ wagmiConfig, timestamp })
  }

  throw new Error(`Unsupported chainId: ${chainId}`)
}
