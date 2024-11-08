import { Chain, base } from 'wagmi/chains'
import { SUPPORTED_CHAINS } from '../chain/constants'

export interface GetChainsParams {
  forkChain?: Chain
}

export function getChains({ forkChain }: GetChainsParams): readonly [Chain, ...Chain[]] {
  const supportedChains = SUPPORTED_CHAINS.filter((chain) => {
    if (import.meta.env.VITE_FEATURE_BASE_SUPPORT !== '1' && chain.id === base.id) {
      return false
    }

    return true
  })

  return [...supportedChains, forkChain].filter(Boolean) as [Chain, ...Chain[]]
}
