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
    queryKey: [
      {
        entity: 'readContract',
        functionName: 'borrowAllowance',
        args: [fromUser, toUser],
        chainId,
      },
    ],
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
