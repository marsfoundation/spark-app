import { UseInjectedNetworkResult } from '@/domain/sandbox/useInjectedNetwork'
import { SandboxNetwork } from '@/domain/state/sandbox'
import { raise } from '@/utils/assert'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { Chain } from 'viem'
import { gnosis, mainnet } from 'viem/chains'
import { Config } from 'wagmi'
import { SUPPORTED_CHAINS } from '../chain/constants'
import { getTransports } from './getTransports'
import { getWallets } from './getWallets'
import { createWagmiStorage } from './storage'

const wallets = getWallets()

export interface GetConfigOptions {
  sandboxNetwork?: SandboxNetwork
  injectedNetwork?: UseInjectedNetworkResult
}

export function getConfig({ sandboxNetwork, injectedNetwork }: GetConfigOptions = {}): Config {
  const forkChain = getForkChainFromSandboxConfig(sandboxNetwork)
  const transports = getTransports({ injectedNetwork, forkChain })

  const storage = createWagmiStorage()

  const config = getDefaultConfig({
    appName: 'Spark',
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID || raise('Missing VITE_WALLET_CONNECT_ID'),
    chains: forkChain ? [...SUPPORTED_CHAINS, forkChain] : SUPPORTED_CHAINS,
    transports,
    wallets,
    storage,
  })

  return config
}

function getForkChainFromSandboxConfig(sandboxNetwork?: SandboxNetwork): Chain | undefined {
  if (!sandboxNetwork) {
    return undefined
  }

  const base = (() => {
    if (sandboxNetwork.originChainId === mainnet.id) {
      return mainnet
    }
    if (sandboxNetwork.originChainId === gnosis.id) {
      return gnosis
    }
    throw new Error(`Unsupported origin chain = ${sandboxNetwork.originChainId}!`)
  })()

  return {
    ...base,
    id: sandboxNetwork.forkChainId,
    name: sandboxNetwork.name,
    rpcUrls: {
      public: { http: [sandboxNetwork.forkUrl] },
      default: { http: [sandboxNetwork.forkUrl] },
    },
  }
}
