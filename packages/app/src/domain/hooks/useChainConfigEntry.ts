import { getChainConfigEntry } from '@/config/chain'
import { ChainConfigEntry } from '@/config/chain/types'
import { useChainId } from 'wagmi'

export function useChainConfigEntry(): ChainConfigEntry {
  const chainId = useChainId()
  return getChainConfigEntry(chainId)
}
