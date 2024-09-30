import { Chain } from 'wagmi/chains'
import { SUPPORTED_CHAINS } from '../chain/constants'

export interface GetChainsParams {
  forkChain?: Chain
}

export function getChains({ forkChain }: GetChainsParams): readonly [Chain, ...Chain[]] {
  return [...SUPPORTED_CHAINS, forkChain].filter(Boolean) as [Chain, ...Chain[]]
}
