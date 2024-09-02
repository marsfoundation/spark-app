import { http, Chain, Transport } from 'viem'
import { gnosis, mainnet } from 'viem/chains'
import { VIEM_TIMEOUT_ON_FORKS } from './config.e2e'
import { getInjectedNetwork } from './getInjectedNetwork'

const ALCHEMY_API_KEY = 'WVOCPHOxAVE1R9PySEqcO7WX2b9_V-9L'

export interface GetTransportsParamsOptions {
  forkChain?: Chain
  usdsDevChain?: Chain
}

export type GetTransportsResult = Record<number, Transport>

export function getTransports({ forkChain, usdsDevChain }: GetTransportsParamsOptions): GetTransportsResult {
  const transports: Record<number, Transport> = {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [gnosis.id]: http('https://rpc.ankr.com/gnosis'),
  }

  if (forkChain) {
    transports[forkChain.id] = http(forkChain.rpcUrls.default.http[0], { timeout: VIEM_TIMEOUT_ON_FORKS })
  }

  if (usdsDevChain) {
    transports[usdsDevChain.id] = http(usdsDevChain.rpcUrls.default.http[0])
  }

  if (import.meta.env.VITE_FEATURE_RPC_INJECTION_VIA_URL === '1') {
    const injectedNetwork = getInjectedNetwork()
    if (injectedNetwork) {
      transports[injectedNetwork.chainId] = http(injectedNetwork.rpc)
    }
  }

  return transports
}
