import { useChainId } from 'wagmi'
import { getChainConfigEntry } from '.'
import { ChainConfigEntry } from './types'

export function useChainConfigEntry(): ChainConfigEntry {
  const chainId = useChainId()
  return getChainConfigEntry(chainId)
}
