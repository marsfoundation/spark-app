import { useQuery } from '@tanstack/react-query'

import { ReadHookParams } from './types'

type VpnResponse = {
  isConnectedToVpn: boolean
  countryCode: string
}

async function checkVpn(authUrl: string): Promise<VpnResponse> {
  if (!authUrl) {
    throw new Error('Missing auth URL')
  }

  let isConnectedToVpn = false
  let countryCode = ''
  // TODO is this the best way to get a user's IP address?
  const ipRes = await fetch('https://api.ipify.org/?format=json')
  if (!ipRes.ok) {
    throw new Error('Could not fetch IP address')
  }

  const { ip } = (await ipRes.json()) as any
  const vpnRes = await fetch(`${authUrl}/ip/status?ip=${ip}`)
  if (!vpnRes.ok) {
    throw new Error('Could not fetch VPN status')
  }

  const { country_code, is_vpn } = (await vpnRes.json()) as any

  countryCode = country_code
  isConnectedToVpn = is_vpn

  return { countryCode, isConnectedToVpn }
}

type Props = ReadHookParams<VpnResponse> & { authUrl: string }

export function useVpnCheck({
  authUrl,
  refetchInterval = 60000, // default to perform VPN check every 60 seconds
  ...options
}: Props): { data: VpnResponse | undefined; error: any | undefined; isLoading: boolean } {
  const { data, error, isLoading } = useQuery({
    queryKey: ['vpn'],
    queryFn: () => checkVpn(authUrl),
    refetchInterval,
    ...options,
  })

  return { data, error, isLoading: !data && isLoading }
}
