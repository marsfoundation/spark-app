import { Address } from 'viem'
import { useChainId, useChains } from 'wagmi'

export function useBlockExplorerAddressLink(address: Address | undefined): string | undefined {
  const chainId = useChainId()
  const chains = useChains()

  const chain = chains.find((chain) => chain.id === chainId)
  const blockExplorerLink = chain?.blockExplorers?.default.url

  if (!address || !blockExplorerLink) {
    return undefined
  }

  return `${blockExplorerLink}/address/${address}`
}
