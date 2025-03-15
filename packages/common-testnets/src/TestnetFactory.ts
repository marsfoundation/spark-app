import { Chain, Hash, TransactionReceipt } from 'viem'
import { TestnetClient } from './TestnetClient.js'

export interface TestnetCreateResult {
  client: TestnetClient
  rpcUrl: string
  publicRpcUrl?: string // url that it's safe to leak as "cheat" methods like setting balances are disabled. Not all testnets supports this so it's optional
  cleanup: () => Promise<void>
  [Symbol.asyncDispose](): Promise<void>
}
/**
 * The created testnet will have a small, though known beforehand, difference in both the final block number
 * and its timestamp compared to the requested block. This is due to necessary normalization
 * steps that ensure compatibility with different client implementations.
 */
export interface TestnetFactory {
  create(network: CreateNetworkArgs): Promise<TestnetCreateResult>
  createClientFromUrl(rpcUrl: string, chain: Chain, forkChainId: number): TestnetClient
}

export interface CreateNetworkArgs {
  id: string
  displayName?: string
  originChain: Chain
  forkChainId: number
  blockNumber?: bigint
  onTransaction?: OnTransactionHandler
}

export type OnTransactionHandler = (ctx: {
  forkChainId: number
  receipt?: TransactionReceipt
  txHash?: Hash
}) => Promise<void>
