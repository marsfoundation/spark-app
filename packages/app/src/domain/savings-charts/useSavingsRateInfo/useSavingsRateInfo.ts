import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { savingsRateQueryOptions } from './query'
import { SavingsRateInfo } from './types'

export interface UseSavingsRateInfoParams {
  chainId: number
}
export type UseSavingsRateInfoResult = Pick<UseQueryResult<SavingsRateInfo>, 'data' | 'isLoading' | 'error'>

export function useSavingsRateInfo({ chainId }: UseSavingsRateInfoParams): UseSavingsRateInfoResult {
  return useQuery({
    ...savingsRateQueryOptions({
      chainId,
    }),
  })
}
