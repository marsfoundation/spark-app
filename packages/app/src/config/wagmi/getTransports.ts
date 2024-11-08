import { http, Chain, Transport } from 'viem'
import { VIEM_TIMEOUT_ON_FORKS } from './config.e2e'
import { getInjectedNetwork } from './getInjectedNetwork'
import { lastSepolia } from '../chain/constants'

export interface GetTransportsParamsOptions {
  forkChain?: Chain
  baseDevNetChain?: Chain
}

export type GetTransportsResult = Record<number, Transport>

export function getTransports({ forkChain, baseDevNetChain }: GetTransportsParamsOptions): GetTransportsResult {
  const transports: Record<number, Transport> = {
    [lastSepolia.id]: http('https://rpc-devnet-a62hx4f2t5.t.conduit.xyz'),
  }

  if (forkChain) {
    transports[forkChain.id] = http(forkChain.rpcUrls.default.http[0], { timeout: VIEM_TIMEOUT_ON_FORKS })
  }

  if (baseDevNetChain) {
    transports[baseDevNetChain.id] = http(baseDevNetChain.rpcUrls.default.http[0])
  }

  if (import.meta.env.VITE_FEATURE_RPC_INJECTION_VIA_URL === '1') {
    const injectedNetwork = getInjectedNetwork()
    if (injectedNetwork) {
      transports[injectedNetwork.chainId] = http(injectedNetwork.rpc)
    }
  }

  return transports
}
