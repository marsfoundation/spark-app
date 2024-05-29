import { apiUrl } from '@/config/consts'
import { paths } from '@/config/paths'

import { blockedPagesByCountryCode } from './consts'
import { useVpnCheck } from './useVpnCheck'

export function useBlockedPages(): (keyof typeof paths)[] {
  if (import.meta.env.VITE_FEATURE_AUTH_IP_AND_ADDRESS_CHECKS !== '1') {
    return []
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const vpnCheck = useVpnCheck({ authUrl: apiUrl })

  if (vpnCheck.data && blockedPagesByCountryCode[vpnCheck.data.countryCode] !== undefined) {
    return blockedPagesByCountryCode[vpnCheck.data.countryCode]!
  }

  return []
}
