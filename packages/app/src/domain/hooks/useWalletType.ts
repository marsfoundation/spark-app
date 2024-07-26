import { useAccount } from 'wagmi'
import { useSandboxState } from '../sandbox/useSandboxState'
import { useIsSmartContract } from './useIsSmartContract'

export type WalletType = 'gnosis-safe' | 'sandbox' | 'unknown' | string // string means connector type ie. 'walletconnect' or 'metamask'

export function useWalletType(): WalletType | undefined {
  const { address, connector } = useAccount()
  const { isInSandbox } = useSandboxState()
  const canBeGnosisSafe = connector?.name === 'WalletConnect' || connector?.name === 'Safe' // avoids querying bytecode if not needed
  const { isSmartContract } = useIsSmartContract(canBeGnosisSafe ? address : undefined)

  if (!address) {
    return undefined
  }

  if (!canBeGnosisSafe) {
    if (isInSandbox) {
      return 'sandbox'
    }
    return connector?.name || 'unknown'
  }

  if (isSmartContract) {
    return 'gnosis-safe' // this assumes that Gnosis Safe is the only smart contract wallet
  }

  return undefined
}
