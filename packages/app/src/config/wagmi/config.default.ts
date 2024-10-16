import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { Chain } from 'viem'
import { base, gnosis, mainnet } from 'viem/chains'
import { Config } from 'wagmi'

import { SandboxNetwork } from '@/domain/state/sandbox'
import { raise } from '@/utils/assert'

import { getChains } from './getChains'
import { getTransports } from './getTransports'
import { getWallets } from './getWallets'
import { createWagmiStorage } from './storage'

const wallets = getWallets()

export function getConfig(sandboxNetwork?: SandboxNetwork): Config {
  const forkChain = getForkChainFromSandboxConfig(sandboxNetwork)
  const baseDevNetChain = getBaseDevNetChain()
  const transports = getTransports({ forkChain, baseDevNetChain })
  const chains = getChains({ forkChain, baseDevNetChain })
  const storage = createWagmiStorage()

  const config = getDefaultConfig({
    appName: 'Spark',
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID || raise('Missing VITE_WALLET_CONNECT_ID'),
    chains,
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
