import {
  http,
  Chain,
  Hex,
  Transport,
  WalletCallReceipt,
  createTransport,
  createWalletClient,
  keccak256,
  stringToHex,
  toHex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base, gnosis, mainnet } from 'viem/chains'
import { Config, createConfig } from 'wagmi'
import { z } from 'zod'

import { SandboxNetwork } from '@/domain/state/sandbox'
import { createMockConnector } from '@/domain/wallet/createMockConnector'

import { viemAddressSchema } from '@/domain/common/validation'
import { getConfig } from './config.default'
import {
  PLAYWRIGHT_CHAIN_ID,
  PLAYWRIGHT_WALLET_ADDRESS_KEY,
  PLAYWRIGHT_WALLET_FORK_URL_KEY,
  PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY,
} from './e2e-consts'

export const VIEM_TIMEOUT_ON_FORKS = 60_000 // forks tend to be slow. This improves reliability/performance. Default is 10_000

type PrivateKey = `0x${string}`
const privateKeySchema = z.custom<PrivateKey>((privateKey) => {
  const privateKeyRegex = /^0x[a-fA-F0-9]{64}$/

  return privateKeyRegex.test(privateKey as string)
})

export function getInjectedTransport(): Transport {
  return http((window as any)[PLAYWRIGHT_WALLET_FORK_URL_KEY], { timeout: VIEM_TIMEOUT_ON_FORKS })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getMockConnectors(chain: Chain) {
  // Injects a mock connector if a wallet address or private key are injected into window object.
  // Private key takes precedence over address.
  const savedAddressSafeParse = viemAddressSchema.safeParse((window as any)[PLAYWRIGHT_WALLET_ADDRESS_KEY])
  const savedAddress = savedAddressSafeParse.success ? savedAddressSafeParse.data : undefined
  const savedPrivateKeySafeParse = privateKeySchema.safeParse((window as any)[PLAYWRIGHT_WALLET_PRIVATE_KEY_KEY])
  const savedPrivateKey = savedPrivateKeySafeParse.success ? savedPrivateKeySafeParse.data : undefined
  const account = savedPrivateKey ? privateKeyToAccount(savedPrivateKey) : savedAddress

  if (!account) {
    return []
  }

  const walletClient = createWalletClient({
    transport: (...args) => {
      const transactionCache = new Map<Hex, Hex[]>()

      const { request: requestByHttp } = getInjectedTransport()(...args)

      return createTransport({
        key: 'e2e',
        name: 'E2E JSON-RPC',
        type: 'e2e',
        async request({ method, params }) {
          if (method === 'wallet_getCapabilities') {
            return {
              [toHex(chain.id)]: {
                atomicBatch: {
                  supported: true,
                },
              },
            }
          }

          if (method === 'wallet_sendCalls') {
            const hashes: Hex[] = []
            const calls = (params as any)[0].calls
            for (const call of calls) {
              const result = await requestByHttp({
                method: 'eth_sendTransaction',
                params: [
                  {
                    ...call,
                    from: typeof account === 'string' ? account : account.address,
                  },
                ],
              })
              hashes.push(result as Hex)
            }
            const id = keccak256(stringToHex(JSON.stringify(calls)))
            transactionCache.set(id, hashes)
            return id
          }

          if (method === 'wallet_getCallsStatus') {
            const hashes = transactionCache.get((params as any)[0])
            if (!hashes) return null
            const receipts = await Promise.all(
              hashes.map(async (hash) => {
                const result = (await requestByHttp({
                  method: 'eth_getTransactionReceipt',
                  params: [hash],
                })) as any
                return {
                  blockHash: result.blockHash,
                  blockNumber: result.blockNumber,
                  gasUsed: result.gasUsed,
                  logs: result.logs,
                  status: result.status,
                  transactionHash: result.transactionHash,
                } satisfies WalletCallReceipt
              }),
            )
            if (receipts.some((x) => !x)) return { status: 'PENDING', receipts: [] }
            return { status: 'CONFIRMED', receipts }
          }

          return requestByHttp({ method, params }) as any
        },
        ...args,
      })
    },
    chain,
    pollingInterval: 100,
    account,
  })

  const mockConnector = createMockConnector(walletClient)

  return [mockConnector]
}

export function getMockConfig(sandboxNetwork?: SandboxNetwork): Config {
  // if not configured properly assume just fallback to default config
  if (!(window as any)[PLAYWRIGHT_WALLET_FORK_URL_KEY]) {
    console.warn('Mock config not found. Loading default config.')
    return getConfig(sandboxNetwork)
  }

  const chain = chainIdToChain[(window as any)[PLAYWRIGHT_CHAIN_ID] as number]!
  const connectors = getMockConnectors(chain)

  const config = createConfig({
    chains: [chain],
    transports: { [chain.id]: getInjectedTransport() },
    connectors,
  })

  return config
}

const chainIdToChain: Record<number, Chain> = {
  [gnosis.id]: gnosis,
  [mainnet.id]: mainnet,
  [base.id]: {
    ...base,
    name: 'Base DevNet',
  },
}
