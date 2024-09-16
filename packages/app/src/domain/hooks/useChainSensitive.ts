import { useEffect, useState } from 'react'
import { useChainId } from 'wagmi'

export interface UseChainSensitiveParams {
  onChainChange: (chain: number) => void
}

export function useChainSensitive({ onChainChange }: UseChainSensitiveParams): boolean {
  const chainId = useChainId()
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
