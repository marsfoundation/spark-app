import { Hash, raise } from '@marsfoundation/common-universal'
import { Address, PublicActions, WalletClient } from 'viem'

export interface TestnetClient extends WalletClient, PublicActions {
  setErc20Balance(tkn: Address, usr: Address, amount: bigint): Promise<void>
  setBalance(usr: Address, amount: bigint): Promise<void>
  setStorageAt(addr: Address, slot: Hash, value: string): Promise<void>
  snapshot(): Promise<string>
  revert(snapshotId: string): Promise<string> // @note: returns new snapshot id (may be the same as the input)
  mineBlocks(blocks: bigint): Promise<void>
  setNextBlockTimestamp(timestamp: bigint): Promise<void>
}

export function getUrlFromClient(client: TestnetClient): string {
  return client.transport.type === 'http' ? client.transport.url : raise('Only http transport is supported')
}
