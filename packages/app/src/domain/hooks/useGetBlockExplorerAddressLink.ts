import { Address } from 'viem'
import { useBlockExplorerLink } from './useBlockExplorerLink'

export function useGetBlockExplorerAddressLink(): (address: Address) => string | undefined {
  const blockExplorerLink = useBlockExplorerLink()

  if (!blockExplorerLink) {
    return () => undefined
  }

  return (address: Address) => `${blockExplorerLink}/address/${address}`
}
