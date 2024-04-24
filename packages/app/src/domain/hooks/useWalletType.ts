import { Address } from 'viem'
import { useAccount, useBytecode } from 'wagmi'

export type WalletType = 'gnosis-safe' | 'universal'

export function useWalletType(): WalletType | undefined {
  const { address, connector } = useAccount()
  const canBeGnosisSafe = connector?.name === 'WalletConnect' // avoids querying bytecode if not needed
  const isSmartContract = useIsSmartContract(canBeGnosisSafe ? address : undefined)

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

function useIsSmartContract(address: Address | undefined): boolean | undefined {
  const response = useBytecode({ address })

  if (!response.data) {
    return undefined
  }

  return response.data.length > 0
}
