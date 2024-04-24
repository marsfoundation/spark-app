import { useChainId } from 'wagmi'

import { SupportedChainId } from '@/config/chain/types'

import { useStore } from '../state'
import { SandboxNetwork } from '../state/sandbox'

/**
 * If user is in sandbox mode, it returns chain id of underlying (origin) chain.
 */
export function useOriginChainId(): SupportedChainId {
  const chainId = useChainId()
  const sandbox = useStore((state) => state.sandbox.network)

  return getOriginChainId(chainId, sandbox)
}

/**
 * Why do we *need* this cache? This is not for performance reasons but rather to avoid subtle timing issues (FRO-438).
 * When user enters sandbox mode, while being already in the sandbox mode, the app can re-render with store.sandboxNetwork already updated but user wallet still connected to the old sandbox.
 * This can result in unknown network error. This workaround be remove if we don't allow creating another sandboxs while being already in a sandbox mode.
 */
const chainIdToOriginChainIdCache = new Map<number, number>()
export function getOriginChainId(chainId: number, sandboxNetwork: SandboxNetwork | undefined): SupportedChainId {
  if (chainIdToOriginChainIdCache.has(chainId)) {
    return chainIdToOriginChainIdCache.get(chainId)! as SupportedChainId
  }
  if (chainId === sandboxNetwork?.forkChainId) {
    chainIdToOriginChainIdCache.set(chainId, sandboxNetwork.originChainId)
    return sandboxNetwork.originChainId as SupportedChainId
  }
  return chainId as SupportedChainId
}
