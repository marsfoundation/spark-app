import { Address } from 'viem'

export interface GetBalancesQueryKeyPrefixParams {
  account: Address | undefined
  chainId: number
}

export function getBalancesQueryKeyPrefix({ account, chainId }: GetBalancesQueryKeyPrefixParams): unknown[] {
  return ['balances', account, chainId]
}
