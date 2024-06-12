import { mainnet } from 'viem/chains'
import { createStorage, noopStorage } from 'wagmi'
import { SUPPORTED_CHAINS } from '../chain/constants'

export function createWagmiStorage(): ReturnType<typeof createStorage> {
  const defaultStorage = createStorage({
    storage: typeof window !== 'undefined' && window.localStorage ? window.localStorage : noopStorage,
  })
  const storage: typeof defaultStorage = {
    ...defaultStorage,
    getItem: wrapGetItem(defaultStorage),
  }

  return storage
}

function wrapGetItem(defaultStorage: ReturnType<typeof createStorage>): any {
  return async function getItem(key: 'recentConnectorId' | 'store'): Promise<any> {
    const originalValue = (await defaultStorage.getItem(key as any)) as any

    if ((key as any) === 'store' && typeof originalValue === 'object') {
      const persistedChainId = originalValue?.state?.chainId
      const connections: Map<string, { chainId: number }> = originalValue?.state?.connections || new Map()

      const filteredConnections = new Map(
        [...connections.entries()].filter(([_, { chainId }]) => {
          return SUPPORTED_CHAINS.some((chain) => chain.id === chainId)
        }),
      )
      const newChainId = SUPPORTED_CHAINS.some((chain) => chain.id === persistedChainId) ? persistedChainId : mainnet.id

      return {
        ...originalValue,
        state: {
          ...originalValue?.state,
          connections: filteredConnections,
          chainId: newChainId,
        },
      } as any
    }
    return originalValue
  }
}
