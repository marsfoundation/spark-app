import { useAccount } from 'wagmi'

import { apiUrl } from '@/config/consts'

import { blockedCountryCodes } from './consts'
import { useIsCurrentPageBlocked } from './useIsCurrentPageBlocked'
import { useRestrictedAddressCheck } from './useRestrictedAddressCheck'
import { useVpnCheck } from './useVpnCheck'

type NotBlocked = { blocked: false }
type BlockedByVpn = { blocked: true; reason: 'vpn-detected' }
type BlockedByAddress = { blocked: true; reason: 'address-not-allowed' }
type BlockedByRegion = {
  blocked: true
  reason: 'region-blocked' | 'page-not-available-in-region'
  data: { countryCode: string }
}

export type UseIPAndAddressCheck = NotBlocked | BlockedByVpn | BlockedByAddress | BlockedByRegion
export function useIPAndAddressCheck(): UseIPAndAddressCheck {
  const addressCheck: NotBlocked | BlockedByAddress = (() => {
    if (import.meta.env.VITE_FEATURE_VERIFY_ADDRESS !== '1') {
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

    if (addressCheck.data?.addressAllowed === false) {
      return { blocked: true, reason: 'address-not-allowed' }
    }

    return { blocked: false }
  })()

  const vpnCheck: NotBlocked | BlockedByVpn = (() => {
    if (import.meta.env.VITE_FEATURE_BLOCK_VPN !== '1') {
      return { blocked: false }
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    const vpnCheck = useVpnCheck()

    if (vpnCheck.data?.isConnectedToVpn) {
      return { blocked: true, reason: 'vpn-detected' }
    }

    return { blocked: false }
  })()

  const regionCheck: NotBlocked | BlockedByRegion = (() => {
    if (import.meta.env.VITE_FEATURE_BLOCK_REGIONS !== '1') {
      return { blocked: false }
    }

    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    const vpnCheck = useVpnCheck()
    // biome-ignore lint/correctness/useHookAtTopLevel: <explanation>
    const isCurrentPageBlocked = useIsCurrentPageBlocked()

    if (vpnCheck.data?.countryCode && blockedCountryCodes.includes(vpnCheck.data.countryCode)) {
      return { blocked: true, reason: 'region-blocked', data: { countryCode: vpnCheck.data.countryCode } }
    }

    if (vpnCheck.data?.countryCode && isCurrentPageBlocked) {
      return {
        blocked: true,
        reason: 'page-not-available-in-region',
        data: { countryCode: vpnCheck.data.countryCode },
      }
    }

    return { blocked: false }
  })()

  if (addressCheck.blocked) {
    return addressCheck
  }

  if (vpnCheck.blocked) {
    return vpnCheck
  }

  if (regionCheck.blocked) {
    return regionCheck
  }

  return { blocked: false }
}
