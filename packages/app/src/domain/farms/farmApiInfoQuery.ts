import { FarmConfig } from '@/domain/farms/types'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { getFarmApiInfo } from './getFarmApiInfo'

export interface FarmsApiInfoQueryOptionsParams {
  farmConfigs: FarmConfig[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmsApiInfoQueryOptions({ farmConfigs }: FarmsApiInfoQueryOptionsParams) {
  return queryOptions({
    queryKey: getFarmsApiInfoQueryKey(),
    queryFn: async () => {
      return await Promise.all(farmConfigs.map((farmConfig) => getFarmApiInfo({ farmConfig })))
    },
  })
}

export function getFarmsApiInfoQueryKey(): QueryKey {
  return ['farmsApiInfo']
}
