import { http, createPublicClient } from 'viem'

import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { toHex } from '@/utils/bigNumber'

import { QueryClient } from '@tanstack/react-query'
import { request } from '../sandbox/request'

async function setBalance(forkUrl: string, address: string, balance: BaseUnitNumber): Promise<void> {
  await request(forkUrl, 'tenderly_setBalance', [address, toHex(balance)])
}

async function setTokenBalance(
  forkUrl: string,
  tokenAddress: string,
  walletAddress: string,
  balance: BaseUnitNumber,
): Promise<void> {
  await request(forkUrl, 'tenderly_setErc20Balance', [tokenAddress, walletAddress, toHex(balance)])
}

async function snapshot(forkUrl: string): Promise<string> {
  return request(forkUrl, 'evm_snapshot', [])
}

async function revertToSnapshot(forkUrl: string, checkpoint: string): Promise<void> {
  await request(forkUrl, 'evm_revert', [checkpoint])
}

async function evmIncreaseTime(forkUrl: string, seconds: number): Promise<void> {
  await request(forkUrl, 'evm_increaseTime', [seconds])
}

/**
 * Set the timestamp of the next block that will be mined, all CALLs (reads) will use updated timestamp as well.
 */
async function evmSetNextBlockTimestamp(forkUrl: string, timestamp: number): Promise<void> {
  await request(forkUrl, 'evm_setNextBlockTimestamp', [timestamp])
  const client = createPublicClient({
    transport: http(forkUrl),
  })
  // evm_setNextBlockTimestamp mines a new block. We need to wait for the block to be mined.
  // We retry the query until the block timestamp is the expected one.
  await new QueryClient().fetchQuery({
    queryKey: ['evm_setNextBlockTimestamp', 'wait', timestamp],
    queryFn: async () => {
      const block = await client.getBlock()
      if (block.timestamp !== BigInt(timestamp)) {
        throw new Error(`Block timestamp is ${block.timestamp}, expected ${timestamp}`)
      }
      return block
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(150 * 2 ** attemptIndex, 10_000),
  })
}

export const tenderlyRpcActions = {
  setBalance,
  setTokenBalance,
  snapshot,
  revertToSnapshot,
  evmIncreaseTime,
  evmSetNextBlockTimestamp,
}
