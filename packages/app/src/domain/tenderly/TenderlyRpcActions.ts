import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { toHex } from '@/utils/bigNumber'

import { Hash } from 'viem'
import { z } from 'zod'
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

const snapshotResponseSchema = z.object({
  result: z
    .string()
    .startsWith('0x')
    .transform((value) => value as Hash),
})

async function snapshot(forkUrl: string): Promise<Hash> {
  const response = await request(forkUrl, 'evm_snapshot', [])
  return snapshotResponseSchema.parse(response).result
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
}

export const tenderlyRpcActions = {
  setBalance,
  setTokenBalance,
  snapshot,
  revertToSnapshot,
  evmIncreaseTime,
  evmSetNextBlockTimestamp,
}
