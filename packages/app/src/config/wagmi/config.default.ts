import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { Chain } from 'viem'
import { gnosis, mainnet } from 'viem/chains'
import { Config } from 'wagmi'

import { SandboxNetwork } from '@/domain/state/sandbox'
import { raise } from '@/utils/assert'

import { NST_DEV_CHAIN_ID } from '../chain/constants'
import { getChains } from './getChains'
import { getTransports } from './getTransports'
import { getWallets } from './getWallets'
import { createWagmiStorage } from './storage'

const wallets = getWallets()

export function getConfig(sandboxNetwork?: SandboxNetwork): Config {
  const forkChain = getForkChainFromSandboxConfig(sandboxNetwork)
  const nstDevChain = getNSTDevChain()
  const transports = getTransports({ forkChain, nstDevChain })
  const chains = getChains({ forkChain, nstDevChain })
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

function getNSTDevChain(): Chain | undefined {
  if (typeof import.meta.env.VITE_DEV_NST_NETWORK_RPC_URL !== 'string') {
    return undefined
  }

  return {
    ...mainnet,
    id: NST_DEV_CHAIN_ID,
    name: 'NST DevNet',
    rpcUrls: {
      public: { http: [import.meta.env.VITE_DEV_NST_NETWORK_RPC_URL] },
      default: { http: [import.meta.env.VITE_DEV_NST_NETWORK_RPC_URL] },
    },
  }
}
