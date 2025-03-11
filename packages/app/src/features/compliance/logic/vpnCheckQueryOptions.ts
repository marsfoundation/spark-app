import { apiUrl } from '@/config/consts'
import { queryOptions } from '@tanstack/react-query'
import { z } from 'zod'

export type VpnResponse = z.infer<typeof apiResponseSchema>
const apiResponseSchema = z
  .object({
    is_vpn: z.boolean(),
    country_code: z.string().nullable(),
  })
  .transform(({ is_vpn, country_code }) => {
    return {
      countryCode: country_code ?? undefined,
      isConnectedToVpn: is_vpn,
    }
  })

async function checkVpn(authUrl: string): Promise<VpnResponse> {
  if (!authUrl) {
    throw new Error('Missing auth URL')
  }

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

  const { countryCode, isConnectedToVpn } = apiResponseSchema.parse(await vpnRes.json())

  return { countryCode, isConnectedToVpn }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function vpnCheckQueryOptions() {
  return queryOptions({
    queryKey: ['vpn'],
    queryFn: () => checkVpn(apiUrl),
    refetchInterval: 60 * 1000, // default to perform VPN check every 60 seconds
  })
}
