import { formatGwei } from 'viem'

import { toBigInt } from '@/utils/bigNumber'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export function formatGasPrice(gasPrice: NormalizedUnitNumber): string {
  const formattedGwei = formatGwei(toBigInt(gasPrice.shiftedBy(18)))
  const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  })
  return formatter.format(Number(formattedGwei))
}
