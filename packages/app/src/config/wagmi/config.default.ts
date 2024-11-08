import { Chain } from 'viem'
import { base } from 'viem/chains'
import { Config, createConfig } from 'wagmi'

import { SandboxNetwork } from '@/domain/state/sandbox'

import { getChains } from './getChains'
import { getTransports } from './getTransports'
import { createWagmiStorage } from './storage'
import { lastSepolia } from '../chain/constants'

export function getConfig(sandboxNetwork?: SandboxNetwork): Config {
  const forkChain = getForkChainFromSandboxConfig(sandboxNetwork)
  const baseDevNetChain = getBaseDevNetChain()
  const transports = getTransports({ forkChain, baseDevNetChain })
  const chains = getChains({ forkChain, baseDevNetChain })
  const storage = createWagmiStorage()

  const config = createConfig({
    chains,
    transports,
    storage,
    multiInjectedProviderDiscovery: false,
  })

  return config
}

function getForkChainFromSandboxConfig(sandboxNetwork?: SandboxNetwork): Chain | undefined {
  if (!sandboxNetwork) {
    return undefined
  }

  const base = (() => {
    if (sandboxNetwork.originChainId === lastSepolia.id) {
      return lastSepolia
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

function getBaseDevNetChain(): Chain | undefined {
  if (typeof import.meta.env.VITE_DEV_BASE_DEVNET_RPC_URL !== 'string') {
    return undefined
  }

  return {
    ...base,
    name: 'Base DevNet',
    rpcUrls: {
      public: { http: [import.meta.env.VITE_DEV_BASE_DEVNET_RPC_URL] },
      default: { http: [import.meta.env.VITE_DEV_BASE_DEVNET_RPC_URL] },
    },
  }
}
