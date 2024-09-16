import { useEffect, useState } from 'react'

export interface UseChainSensitiveParams {
  onChainChange: (chain: number) => void
  chainId: number
}

export function useChainSensitive({ onChainChange, chainId }: UseChainSensitiveParams): boolean {
  const [frozenChainId, setFrozenChainId] = useState(chainId)

  // biome-ignore lint/correctness/useExhaustiveDependencies: frozenChainId will never change
  useEffect(() => {
    if (chainId !== frozenChainId) {
      onChainChange(chainId)
      setFrozenChainId(chainId)
    }
  }, [chainId])

  return chainId === frozenChainId
}
