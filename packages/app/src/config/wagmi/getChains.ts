import { Chain } from 'wagmi/chains'
import { SUPPORTED_CHAINS } from '../chain/constants'

export interface GetChainsParams {
  forkChain?: Chain
  nstDevChain?: Chain
}

export function getChains({ forkChain, nstDevChain }: GetChainsParams): readonly [Chain, ...Chain[]] {
  return [...SUPPORTED_CHAINS, forkChain, nstDevChain].filter(Boolean) as [Chain, ...Chain[]]
}
