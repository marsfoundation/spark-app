import { getDefaultConfig, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { Chain, http, Transport, webSocket } from 'viem'
import { gnosis, goerli, mainnet } from 'viem/chains'
import { Config } from 'wagmi'

import { SandboxNetwork } from '@/domain/state/sandbox'
import { raise } from '@/utils/raise'

import { SUPPORTED_CHAINS } from '../chain/constants'
import { SupportedChainId } from '../chain/types'
import { VIEM_TIMEOUT_ON_FORKS } from './config.e2e'

const { wallets } = getDefaultWallets()

const ALCHEMY_API_KEY = 'WVOCPHOxAVE1R9PySEqcO7WX2b9_V-9L'

export function getConfig(sandboxNetwork?: SandboxNetwork): Config {
  const forkChain = getForkChainFromSandboxConfig(sandboxNetwork)

  const transports: Record<SupportedChainId, Transport> = {
    [mainnet.id]: webSocket(`wss://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    [gnosis.id]: http('https://rpc.ankr.com/gnosis'),
  }

  const config = getDefaultConfig({
    appName: 'Spark',
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID || raise('Missing VITE_WALLET_CONNECT_ID'),
    chains: forkChain ? [...SUPPORTED_CHAINS, forkChain] : SUPPORTED_CHAINS,
    transports: forkChain
      ? { ...transports, [forkChain.id]: http(forkChain.rpcUrls.default.http[0], { timeout: VIEM_TIMEOUT_ON_FORKS }) }
      : transports,
    wallets,
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
    if (sandboxNetwork.originChainId === goerli.id) {
      return goerli
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
