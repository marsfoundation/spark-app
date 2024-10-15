import { Chain } from 'wagmi/chains'
import { SUPPORTED_CHAINS } from '../chain/constants'

export interface GetChainsParams {
  forkChain?: Chain
  baseDevNetChain?: Chain
}

export function getChains({ forkChain, baseDevNetChain }: GetChainsParams): readonly [Chain, ...Chain[]] {
  return [...SUPPORTED_CHAINS, forkChain, baseDevNetChain].filter(Boolean) as [Chain, ...Chain[]]
}
