import { Address } from 'viem'
import { useBlockExplorerLink } from './useBlockExplorerLink'

interface useBlockExplorerAddressLinkParams {
  address: Address | undefined
  chainId?: number
}

export function useBlockExplorerAddressLink({
  address,
  chainId,
}: useBlockExplorerAddressLinkParams): string | undefined {
  const blockExplorerLink = useBlockExplorerLink(chainId)

  if (!address || !blockExplorerLink) {
    return undefined
  }

  return `${blockExplorerLink}/address/${address}`
}
