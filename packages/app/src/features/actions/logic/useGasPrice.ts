import { formatEther } from 'viem'
import { useGasPrice as useWagmiGasPrice } from 'wagmi'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export function useGasPrice(): NormalizedUnitNumber | undefined {
  const { data } = useWagmiGasPrice()
  if (!data) {
    return undefined
  }

  return NormalizedUnitNumber(formatEther(data))
}
