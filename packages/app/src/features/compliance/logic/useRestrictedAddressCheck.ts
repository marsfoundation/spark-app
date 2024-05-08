import { useQuery } from '@tanstack/react-query'

import { ReadHookParams } from './types'

type AuthResponse = {
  addressAllowed: boolean
}

async function checkAddress(address?: string, authUrl?: string): Promise<AuthResponse> {
  if (!authUrl) {
    throw new Error('Missing auth URL')
  }
  const wholeUrl = `${authUrl}/address/status?address=${address}`

  let addressAllowed = true
  if (address) {
    const res = await fetch(wholeUrl)
    if (res.status === 200) {
      const data = (await res.json()) as any
      addressAllowed = data.addressAllowed
    } else {
      addressAllowed = false
      throw new Error('non 200 response received')
    }
  }
  return { addressAllowed }
}

type Props = ReadHookParams<AuthResponse> & { address?: string; authUrl: string; enabled: boolean }

export function useRestrictedAddressCheck({ address, authUrl, enabled, ...options }: Props): {
  data: AuthResponse | undefined
  error: any | undefined
  isLoading: boolean
} {
  const { data, error, isLoading } = useQuery({
    queryKey: ['auth', address],
    enabled: !!address && enabled,
    queryFn: () => checkAddress(address, authUrl),
    ...options,
  })

  return { data, error, isLoading: !data && isLoading }
}
