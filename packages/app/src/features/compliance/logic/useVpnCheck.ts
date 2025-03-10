import { useQuery } from '@tanstack/react-query'
import { vpnCheckQueryOptions } from './vpnCheckQueryOptions'

export function useVpnCheck() {
  return useQuery(vpnCheckQueryOptions())
}
