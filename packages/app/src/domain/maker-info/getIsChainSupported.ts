import { goerli, mainnet } from 'viem/chains'

import { getOriginChainId } from '../hooks/useOriginChainId'
import { useStore } from '../state'

const MAKER_INFO_SUPPORTED_CHAIN_IDS = [mainnet, goerli].map((chain) => chain.id)

export function getIsChainSupported(chainId: number): boolean {
  const sandbox = useStore.getState().sandbox.network
  const originChainId = getOriginChainId(chainId, sandbox)

  return MAKER_INFO_SUPPORTED_CHAIN_IDS.includes(originChainId)
}
