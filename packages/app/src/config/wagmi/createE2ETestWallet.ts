import {
  Account,
  Address,
  Chain,
  Hex,
  PrivateKeyAccount,
  Transport,
  WalletClient,
  createTransport,
  createWalletClient,
  keccak256,
  stringToHex,
  toHex,
} from 'viem'
import { getInjectedTransport } from './config.e2e'

export interface CreateMockWalletParams {
  chain: Chain
  account: Address | PrivateKeyAccount
  atomicBatchSupported: boolean
}
export function createE2ETestWallet({
  chain,
  account,
  atomicBatchSupported,
}: CreateMockWalletParams): WalletClient<Transport, Chain, Account> {
  return createWalletClient({
    transport: (...args) => {
      const transactionCache = new Map<Hex, Hex[]>()

      const { request: requestByHttp } = getInjectedTransport()(...args)

      return createTransport({
        key: 'e2e-wallet-transport',
        name: 'E2E Wallet Transport',
        type: 'e2e-wallet',
        async request({ method, params }) {
          if (method === 'wallet_getCapabilities') {
            return {
              [toHex(chain.id)]: {
                atomicBatch: {
                  supported: atomicBatchSupported,
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
                if (result === null) return null

                return {
                  blockHash: result.blockHash,
                  blockNumber: result.blockNumber,
                  gasUsed: result.gasUsed,
                  logs: result.logs,
                  status: result.status,
                  transactionHash: result.transactionHash,
                }
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
    pollingInterval: 100,
    chain,
    account,
  })
}
