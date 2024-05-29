import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useChainId, useConfig } from 'wagmi'

import { borrowAllowance } from './query'

export interface BorrowAllowanceProps {
  fromUser: Address
  toUser: Address
  debtTokenAddress: Address
}

export function useBorrowAllowance({
  fromUser,
  toUser,
  debtTokenAddress,
}: BorrowAllowanceProps): UseQueryResult<bigint, Error> {
  const wagmiConfig = useConfig()
  const chainId = useChainId()

  return useQuery({
    ...borrowAllowance({
      wagmiConfig,
      fromUser,
      toUser,
      debtTokenAddress,
      chainId,
    }),
  })
}
