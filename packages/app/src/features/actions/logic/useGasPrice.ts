import { formatEther } from 'viem'
import { useGasPrice as useWagmiGasPrice } from 'wagmi'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export function useGasPrice(): NormalizedUnitNumber | undefined {
  const { data } = useWagmiGasPrice()
  if (!data) {
    return undefined
  }

  return NormalizedUnitNumber(formatEther(data))
}
