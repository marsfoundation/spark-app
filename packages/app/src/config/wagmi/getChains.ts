import { Chain } from 'wagmi/chains'
import { SUPPORTED_CHAINS } from '../chain/constants'

export interface GetChainsParams {
  forkChain?: Chain
  usdsDevChain?: Chain
}

export function getChains({ forkChain, usdsDevChain }: GetChainsParams): readonly [Chain, ...Chain[]] {
  return [...SUPPORTED_CHAINS, forkChain, usdsDevChain].filter(Boolean) as [Chain, ...Chain[]]
}
