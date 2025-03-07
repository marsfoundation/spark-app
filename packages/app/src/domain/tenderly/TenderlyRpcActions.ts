import { BaseUnitNumber, toBigInt } from '@marsfoundation/common-universal'
import { toHex } from 'viem'
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

export const tenderlyRpcActions = {
  setBalance,
  setTokenBalance,
}
