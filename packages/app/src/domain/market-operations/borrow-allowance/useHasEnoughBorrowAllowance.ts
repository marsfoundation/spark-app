import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'

import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { toBigInt } from '@/utils/bigNumber'

import { borrowAllowance } from './query'
import { BorrowAllowanceProps } from './useBorrowAllowance'

export interface HasEnoughBorrowAllowanceProps extends Omit<BorrowAllowanceProps, 'fromUser'> {
  value: BaseUnitNumber
  enabled?: boolean
}

export function useHasEnoughBorrowAllowance({
  toUser,
  debtTokenAddress,
  value,
  enabled,
}: HasEnoughBorrowAllowanceProps): UseQueryResult<boolean, Error> {
  const wagmiConfig = useConfig()
  const { account, chainId } = useConnectedAddress()

  return useQuery({
    ...borrowAllowance({
      wagmiConfig,
      fromUser: account,
      toUser,
      debtTokenAddress,
      chainId,
    }),
    enabled,
    select: (data) => data >= toBigInt(value),
  })
}
