import { Hash } from '@marsfoundation/common-universal'
import { http, Address, createTestClient, numberToHex, publicActions, walletActions } from 'viem'
import { mainnet } from 'viem/chains'
import { TestnetClient } from '../TestnetClient'

export function getTenderlyClient(rpc: string): TestnetClient {
  return createTestClient({
    chain: mainnet,
    mode: 'anvil',
    transport: http(rpc),
    cacheTime: 0, // do not cache block numbers
  })
    .extend((c) => ({
      async setErc20Balance(tkn: Address, usr: Address, amt: bigint): Promise<void> {
        return c.request({
          method: 'tenderly_setErc20Balance',
          params: [tkn.toString(), usr.toString(), numberToHex(amt)],
        } as any)
      },
      async setBalance(usr: Address, amt: bigint): Promise<void> {
        return c.request({
          method: 'tenderly_setBalance',
          params: [usr.toString(), numberToHex(amt)],
        } as any)
      },
      async setStorageAt(addr: Address, slot: Hash, value: string) {
        await c.request({
          method: 'tenderly_setStorageAt',
          params: [addr.toString(), slot, value],
        } as any)
      },
      async snapshot(): Promise<string> {
        return c.request({
          method: 'evm_snapshot',
          params: [],
        } as any)
      },
      async revert(snapshotId: string) {
        await c.request({
          method: 'evm_revert',
          params: [snapshotId],
        } as any)
        // tenderly doesn't burn the snapshots id so we can reuse it
        return snapshotId
      },
      async mineBlocks(blocks: bigint) {
        await c.request({
          method: 'evm_increaseBlocks',
          params: [numberToHex(blocks)],
        } as any)
      },
      async setNextBlockTimestamp(timestamp: bigint) {
        await c.request({
          method: 'tenderly_setNextBlockTimestamp',
          params: [numberToHex(timestamp)],
        } as any)
      },
    }))
    .extend(walletActions)
    .extend(publicActions)
}
