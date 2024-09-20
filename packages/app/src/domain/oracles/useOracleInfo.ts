import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { useConfig } from 'wagmi'
import { MarketInfo, Reserve } from '../market-info/marketInfo'
import { oracleQueryOptions } from './query'
import { OracleInfo } from './types'

export interface UseOracleInfoParams {
  reserve: Reserve
  marketInfo: MarketInfo
}
export type UseOracleInfoResult = Pick<UseQueryResult<OracleInfo>, 'data' | 'isLoading' | 'error'>

export function useOracleInfo({ reserve, marketInfo }: UseOracleInfoParams): UseOracleInfoResult {
  const wagmiConfig = useConfig()

  return useQuery({
    ...oracleQueryOptions({
      reserve,
      marketInfo,
      wagmiConfig,
    }),
  })
}
