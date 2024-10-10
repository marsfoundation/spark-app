import { FarmConfig } from '@/domain/farms/types'
import { QueryKey, queryOptions } from '@tanstack/react-query'
import { getFarmApiDetails } from './getFarmApiDetails'

export interface FarmsApiDetailsQueryOptionsParams {
  farmConfigs: FarmConfig[]
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function farmsApiDetailsQueryOptions({ farmConfigs }: FarmsApiDetailsQueryOptionsParams) {
  return queryOptions({
    queryKey: getFarmsApiDetailsQueryKey(),
    queryFn: async () => {
      return await Promise.all(farmConfigs.map((farmConfig) => getFarmApiDetails({ farmConfig })))
    },
  })
}

export function getFarmsApiDetailsQueryKey(): QueryKey {
  return ['farmsApiInfo']
}
