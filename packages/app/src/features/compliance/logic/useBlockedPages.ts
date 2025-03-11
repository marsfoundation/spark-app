import { Path } from '@/config/paths'
import { blockedPagesByCountryCode } from './consts'
import { useVpnCheck } from './useVpnCheck'

export function useBlockedPages(): Path[] {
  if (import.meta.env.VITE_FEATURE_BLOCK_REGIONS !== '1') {
    return []
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const vpnCheck = useVpnCheck()

  if (vpnCheck.data?.countryCode && blockedPagesByCountryCode[vpnCheck.data.countryCode] !== undefined) {
    return blockedPagesByCountryCode[vpnCheck.data.countryCode]!
  }

  return []
}
