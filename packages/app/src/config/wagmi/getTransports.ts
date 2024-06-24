import { UseInjectedNetworkResult } from '@/domain/sandbox/useInjectedNetwork'
import { http, Chain, Transport } from 'viem'
import { gnosis, mainnet } from 'viem/chains'
import { SupportedChainId } from '../chain/types'
import { VIEM_TIMEOUT_ON_FORKS } from './config.e2e'

const ALCHEMY_API_KEY = 'WVOCPHOxAVE1R9PySEqcO7WX2b9_V-9L'

export interface GetTransportsParamsOptions {
  injectedNetwork?: UseInjectedNetworkResult
  forkChain?: Chain
}

export type GetTransportsResult = Record<SupportedChainId, Transport>

export function getTransports({ injectedNetwork, forkChain }: GetTransportsParamsOptions): GetTransportsResult {
  const injectedMainnetTransport = injectedNetwork?.chainId === mainnet.id ? http(injectedNetwork.rpc) : undefined
  const injectedGnosisTransport = injectedNetwork?.chainId === gnosis.id ? http(injectedNetwork.rpc) : undefined

  const transports: Record<SupportedChainId, Transport> = {
    [mainnet.id]: injectedMainnetTransport ?? http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [gnosis.id]: injectedGnosisTransport ?? http('https://rpc.ankr.com/gnosis'),
  }

  return forkChain
    ? { ...transports, [forkChain.id]: http(forkChain.rpcUrls.default.http[0], { timeout: VIEM_TIMEOUT_ON_FORKS }) }
    : transports
}
