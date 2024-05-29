import { useMemo } from 'react'
import { Address, privateKeyToAccount } from 'viem/accounts'
import { useChainId } from 'wagmi'

import { useStore } from '@/domain/state'

export interface UseSandboxStateResult {
  isSandboxEnabled: boolean
  isDevSandboxEnabled: boolean
  isInSandbox: boolean
  isEphemeralAccount: (address: Address) => boolean
  deleteSandbox: () => void
}

export function useSandboxState(): UseSandboxStateResult {
  const isSandboxEnabled = import.meta.env.VITE_FEATURE_SANDBOX === '1'
  const isDevSandboxEnabled = import.meta.env.VITE_FEATURE_DEV_SANDBOX === '1'

  if (!isSandboxEnabled) {
    return {
      isInSandbox: false,
      isDevSandboxEnabled: false,
      isSandboxEnabled: false,
      isEphemeralAccount: () => false,
      deleteSandbox: () => {},
    }
  }

  const chainId = useChainId()
  const { network, setNetwork } = useStore((state) => state.sandbox)
  const ephemeralAccountAddress = useMemo(
    () => network?.ephemeralAccountPrivateKey && privateKeyToAccount(network.ephemeralAccountPrivateKey).address,
    [network?.ephemeralAccountPrivateKey],
  )

  return {
    isSandboxEnabled,
    isDevSandboxEnabled,
    isInSandbox: network?.forkChainId === chainId,
    isEphemeralAccount: (address: Address) => ephemeralAccountAddress === address,
    deleteSandbox: () => {
      setNetwork(undefined)
    },
  }
}
