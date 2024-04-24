import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useConfig } from 'wagmi'

import { BaseUnitNumber } from '@/domain/types/NumericValues'
import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'
import { toBigInt } from '@/utils/bigNumber'

import { allowance } from './query'
import { AllowanceProps } from './useAllowance'

export interface HasEnoughAllowanceProps extends AllowanceProps {
  value: BaseUnitNumber
  enabled?: boolean
}

export function useHasEnoughAllowance({
  token,
  spender,
  value,
  enabled,
}: HasEnoughAllowanceProps): UseQueryResult<boolean, Error> {
  const wagmiConfig = useConfig()
  const { account, chainId } = useConnectedAddress()

  return useQuery({
    ...allowance({
      wagmiConfig,
      account,
      token,
      spender,
      chainId,
    }),
    enabled,
    select: (data) => data >= toBigInt(value),
  })
}
