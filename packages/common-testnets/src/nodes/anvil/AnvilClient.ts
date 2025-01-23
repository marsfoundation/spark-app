import { assert, Hash } from '@marsfoundation/common-universal'
import { http, Address, createTestClient, numberToHex, publicActions, walletActions } from 'viem'
import { dealActions } from 'viem-deal'
import { mainnet } from 'viem/chains'
import { TestnetClient } from '../../TestnetClient.js'
import { extendWithTestnetHelpers } from '../extendWithTestnetHelpers.js'

export function getAnvilClient(rpc: string): TestnetClient {
  return createTestClient({
    chain: mainnet,
    mode: 'anvil',
    transport: http(rpc),
    cacheTime: 0, // do not cache block numbers
  })
    .extend(publicActions)
    .extend(dealActions)
    .extend((c) => {
      return {
        async setErc20Balance(tkn: Address, usr: Address, amt: bigint): Promise<void> {
          return await c.deal({
            erc20: tkn.toLowerCase() as any,
            account: usr.toLowerCase() as any,
            amount: amt,
          })
        },
        async setBalance(usr: Address, amt: bigint): Promise<void> {
          return c.request({
            method: 'anvil_setBalance',
            params: [usr.toString(), `0x${amt.toString(16)}`],
          } as any)
        },
        async setStorageAt(addr: Address, slot: Hash, value: string) {
          await c.request({
            method: 'anvil_setStorageAt',
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
          const result = await c.request({
            method: 'evm_revert',
            params: [snapshotId],
          } as any)

          assert(result === true, 'revert failed')

          // anvil snapshots are "burned" after revert so we need to create a new one
          return await c.snapshot()
        },
        async mineBlocks(blocks: bigint) {
          await c.request({
            method: 'anvil_mine',
            params: [numberToHex(blocks), '0x1'],
          })
        },
        async setNextBlockTimestamp(timestamp: bigint) {
          await c.request({
            method: 'evm_setNextBlockTimestamp',
            params: [numberToHex(timestamp)],
          })
        },
      }
    })
    .extend(walletActions)
    .extend(extendWithTestnetHelpers)
}
