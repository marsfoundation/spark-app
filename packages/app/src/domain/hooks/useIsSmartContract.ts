import { Address } from 'viem'
import { useBytecode } from 'wagmi'

export interface UseIsSmartContractResult {
  isSmartContract?: boolean
  isPending: boolean
}

export function useIsSmartContract(address: Address | undefined): UseIsSmartContractResult {
  const response = useBytecode({ address })

  return {
    isPending: response.isPending,
    isSmartContract: response.data && response.data.length > 0,
  }
}
