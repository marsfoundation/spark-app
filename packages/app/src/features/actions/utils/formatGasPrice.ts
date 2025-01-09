import { formatGwei } from 'viem'

import { toBigInt } from '@marsfoundation/common-universal'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export function formatGasPrice(gasPrice: NormalizedUnitNumber): string {
  const formattedGwei = formatGwei(toBigInt(NormalizedUnitNumber.toBaseUnit(gasPrice, 18)))
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  })
  return formatter.format(Number(formattedGwei))
}
