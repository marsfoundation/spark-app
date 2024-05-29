import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'

import { useConnectedAddress } from '@/domain/wallet/useConnectedAddress'

import { allowance } from './query'

export interface AllowanceProps {
  token: Address
  spender: Address
}

export function useAllowance({ token, spender }: AllowanceProps): UseQueryResult<bigint, Error> {
  const { account, chainId } = useConnectedAddress()
  const wagmiConfig = useConfig()

  return useQuery({
    ...allowance({
      wagmiConfig,
      account,
      token,
      spender,
      chainId,
    }),
  })
}
