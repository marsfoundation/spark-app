import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { VpnResponse, vpnCheckQueryOptions } from './vpnCheckQueryOptions'

export function useVpnCheck(): UseQueryResult<VpnResponse> {
  return useQuery(vpnCheckQueryOptions())
}
