import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export function formatWithHighPrecision(value: NormalizedUnitNumber): string {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  })

  return formatter.format(value.toNumber())
}
