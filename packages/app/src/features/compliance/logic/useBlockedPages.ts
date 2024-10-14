import { apiUrl } from '@/config/consts'
import { Path } from '@/config/paths'

import { blockedPagesByCountryCode } from './consts'
import { useVpnCheck } from './useVpnCheck'

export function useBlockedPages(): Path[] {
  if (import.meta.env.VITE_FEATURE_AUTH_IP_AND_ADDRESS_CHECKS !== '1') {
    return []
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const vpnCheck = useVpnCheck({ authUrl: apiUrl })

  if (vpnCheck.data?.countryCode && blockedPagesByCountryCode[vpnCheck.data.countryCode] !== undefined) {
    return blockedPagesByCountryCode[vpnCheck.data.countryCode]!
  }

  return []
}
