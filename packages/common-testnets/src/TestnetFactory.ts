import { TestnetClient } from './TestnetClient'

export interface TestnetCreateResult {
  client: TestnetClient
  cleanup: () => Promise<void>
}

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
