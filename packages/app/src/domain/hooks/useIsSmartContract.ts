import { Address } from 'viem'
import { useBytecode } from 'wagmi'

interface UseIsSmartContractResult {
  isSmartContract?: boolean
  isLoading: boolean
}

export function useIsSmartContract(address: Address | undefined): UseIsSmartContractResult {
  const response = useBytecode({ address })
  return {
    isLoading: response.isLoading,
    isSmartContract: response.data && response.data.length > 0,
  }
}
