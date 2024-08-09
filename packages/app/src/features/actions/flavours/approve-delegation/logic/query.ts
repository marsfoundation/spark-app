import { queryOptions } from '@tanstack/react-query'
import { Address } from 'viem'
import { Config } from 'wagmi'
import { readContract } from 'wagmi/actions'

import { debtTokenAbi } from '@/config/abis/debtTokenAbi'

export interface BorrowAllowanceOptions {
  wagmiConfig: Config
  debtTokenAddress: Address
  fromUser: Address
  toUser: Address
  chainId: number
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function borrowAllowance({ wagmiConfig, debtTokenAddress, fromUser, toUser, chainId }: BorrowAllowanceOptions) {
  return queryOptions<bigint>({
    queryKey: getBorrowAllowanceQueryKey({ fromUser, toUser, chainId, debtTokenAddress }),
    queryFn: () => {
      return readContract(wagmiConfig, {
        functionName: 'borrowAllowance',
        address: debtTokenAddress,
        abi: debtTokenAbi,
        args: [fromUser, toUser],
      })
    },
  })
}

export function getBorrowAllowanceQueryKey({
  debtTokenAddress,
  fromUser,
  toUser,
  chainId,
}: Omit<BorrowAllowanceOptions, 'wagmiConfig'>): unknown[] {
  return [
    {
      entity: 'readContract',
      functionName: 'borrowAllowance',
      address: debtTokenAddress,
      args: [fromUser, toUser],
      chainId,
    },
  ]
}
