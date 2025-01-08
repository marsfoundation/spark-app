import { BaseUnitNumber, toBigInt } from '@marsfoundation/common-universal'
import { toHex } from 'viem'
import { z } from 'zod'
import { request } from '../sandbox/request'

async function setBalance(forkUrl: string, address: string, balance: BaseUnitNumber): Promise<void> {
  await request(forkUrl, 'tenderly_setBalance', [address, toHex(toBigInt(balance))])
}

async function setTokenBalance(
  forkUrl: string,
  tokenAddress: string,
  walletAddress: string,
  balance: BaseUnitNumber,
): Promise<void> {
  await request(forkUrl, 'tenderly_setErc20Balance', [tokenAddress, walletAddress, toHex(toBigInt(balance))])
}

const snapshotResponseSchema = z.object({
  result: z.string().regex(/^[a-zA-Z0-9-]+$/),
})

async function snapshot(forkUrl: string): Promise<string> {
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
