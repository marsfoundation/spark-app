import { TestnetClient } from './TestnetClient'

export interface TestnetCreateResult {
  client: TestnetClient
  cleanup: () => Promise<void>
}
/**
 * The created testnet may have a slight deviation in both the final block number
 * and its timestamp compared to the requested block. This is due to necessary normalization
 * steps that ensure compatibility with different client implementations.
 */
export interface TestnetFactory {
  create(network: CreateNetworkArgs): Promise<TestnetCreateResult>
  createClientFromUrl(rpcUrl: string): TestnetClient
}

export interface CreateNetworkArgs {
  id: string
  displayName?: string
  originChainId: number
  forkChainId: number
  blockNumber?: bigint
}
