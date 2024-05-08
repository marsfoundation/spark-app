import { apiUrl } from '@/config/consts'
import { paths } from '@/config/paths'

import { blockedPagesByCountryCode } from './consts'
import { useVpnCheck } from './useVpnCheck'

export function useBlockedPages(): (keyof typeof paths)[] {
  if (import.meta.env.VITE_FEATURE_AUTH_IP_AND_ADDRESS_CHECKS !== '1') {
    return []
  }
  /* eslint-disable react-hooks/rules-of-hooks */
  const vpnCheck = useVpnCheck({ authUrl: apiUrl })
  /* eslint-enable react-hooks/rules-of-hooks */

  if (vpnCheck.data && blockedPagesByCountryCode[vpnCheck.data.countryCode] !== undefined) {
    return blockedPagesByCountryCode[vpnCheck.data.countryCode]!
  }

  return []
}
