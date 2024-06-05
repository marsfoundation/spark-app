import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export function formatWithPrecision(value: NormalizedUnitNumber): string {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })

  return formatter.format(value.toNumber())
}
