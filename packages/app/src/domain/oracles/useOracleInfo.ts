import { useSuspenseQuery } from '@tanstack/react-query'

import { SuspenseQueryWith } from '@/utils/types'

import { MarketInfo, Reserve } from '../market-info/marketInfo'
import { oracleQueryOptions } from './query'
import { OracleInfo } from './types'
import { useConfig } from 'wagmi'

export interface UseOracleInfoParams {
  reserve: Reserve
  marketInfo: MarketInfo
}
export type UseOracleInfoResult = SuspenseQueryWith<{
  oracleInfo: OracleInfo
}>

export function useOracleInfo({ reserve, marketInfo }: UseOracleInfoParams): UseOracleInfoResult {
  const wagmiConfig = useConfig()

  const res = useSuspenseQuery({
    ...oracleQueryOptions({
      reserve,
      marketInfo,
      wagmiConfig,
    }),
  })

  return {
    ...res,
    oracleInfo: res.data,
  }
}
