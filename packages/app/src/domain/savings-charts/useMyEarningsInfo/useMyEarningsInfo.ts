import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { Address } from 'viem'
import { myEarningsQueryOptions } from './query'
import { MyEarningsInfo } from './types'

export interface UseMyEarningsInfoParams {
  address?: Address
  chainId: number
}
export type UseMyEarningsInfoResult = Pick<UseQueryResult<MyEarningsInfo>, 'data' | 'isLoading' | 'error'>

export function useMyEarningsInfo({ address, chainId }: UseMyEarningsInfoParams): UseMyEarningsInfoResult {
  return useQuery({
    ...myEarningsQueryOptions({
      address,
      chainId,
    }),
  })
}
