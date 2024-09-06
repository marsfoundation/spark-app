import { useChains } from 'wagmi'
import { useOriginChainId } from './useOriginChainId'

export function useBlockExplorerLink(_chainId?: number): string | undefined {
  const originChainId = useOriginChainId()
  const chains = useChains()

  const chainId = _chainId ?? originChainId
  const chain = chains.find((chain) => chain.id === chainId)
  const blockExplorerLink = chain?.blockExplorers?.default.url

  if (!blockExplorerLink) {
    return undefined
  }

  return blockExplorerLink
}
