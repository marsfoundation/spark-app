import { useAccount } from 'wagmi'
import { useIsSmartContract } from './useIsSmartContract'

export type WalletType = 'gnosis-safe' | 'universal'

export function useWalletType(): WalletType | undefined {
  const { address, connector } = useAccount()
  const canBeGnosisSafe = connector?.name === 'WalletConnect' || connector?.name === 'Safe' // avoids querying bytecode if not needed
  const { isSmartContract } = useIsSmartContract(canBeGnosisSafe ? address : undefined)

  if (!address) {
    return undefined
  }

  if (!canBeGnosisSafe) {
    return 'universal'
  }

  if (isSmartContract) {
    return 'gnosis-safe' // this assumes that Gnosis Safe is the only smart contract wallet
  }

  return undefined
}
