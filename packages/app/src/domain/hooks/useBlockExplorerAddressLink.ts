import { Address } from 'viem'
import { useChainId, useChains } from 'wagmi'

interface useBlockExplorerAddressLinkParams {
  address: Address | undefined
  chainId?: number
}

export function useBlockExplorerAddressLink(params: useBlockExplorerAddressLinkParams): string | undefined {
  const currentChainId = useChainId()
  const chains = useChains()

  const { address, chainId = currentChainId } = params

  const chain = chains.find((chain) => chain.id === chainId)
  const blockExplorerLink = chain?.blockExplorers?.default.url

  if (!address || !blockExplorerLink) {
    return undefined
  }

  return `${blockExplorerLink}/address/${address}`
}
