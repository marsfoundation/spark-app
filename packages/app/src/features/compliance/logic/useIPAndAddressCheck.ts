import { useAccount } from 'wagmi'

import { apiUrl } from '@/config/consts'

import { blockedCountryCodes } from './consts'
import { useIsCurrentPageBlocked } from './useIsCurrentPageBlocked'
import { useRestrictedAddressCheck } from './useRestrictedAddressCheck'
import { useVpnCheck } from './useVpnCheck'

export type UseIPAndAddressCheck =
  | { blocked: false }
  | { blocked: true; reason: 'address-not-allowed' | 'vpn-detected' }
  | { blocked: true; reason: 'region-blocked' | 'page-not-available-in-region'; data: { countryCode: string } }
export function useIPAndAddressCheck(): UseIPAndAddressCheck {
  if (import.meta.env.VITE_FEATURE_AUTH_IP_AND_ADDRESS_CHECKS !== '1') {
    return { blocked: false }
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const { address } = useAccount()
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const addressCheck = useRestrictedAddressCheck({
    address,
    authUrl: apiUrl,
    enabled: !!address,
    refetchInterval: 5 * 60 * 1_000, // recheck every 5 minutes
  })
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const vpnCheck = useVpnCheck({ authUrl: apiUrl })
  // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
  const isCurrentPageBlocked = useIsCurrentPageBlocked()

  if (vpnCheck.data?.isConnectedToVpn && import.meta.env.VITE_FEATURE_IGNORE_VPN_CHECK !== '1') {
    return { blocked: true, reason: 'vpn-detected' }
  }

  if (vpnCheck.data?.countryCode && blockedCountryCodes.includes(vpnCheck.data.countryCode)) {
    return { blocked: true, reason: 'region-blocked', data: { countryCode: vpnCheck.data.countryCode } }
  }

  if (addressCheck.data?.addressAllowed === false) {
    return { blocked: true, reason: 'address-not-allowed' }
  }

  if (vpnCheck.data?.countryCode && isCurrentPageBlocked) {
    return {
      blocked: true,
      reason: 'page-not-available-in-region',
      data: { countryCode: vpnCheck.data.countryCode },
    }
  }

  return { blocked: false }
}
