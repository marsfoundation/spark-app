import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export function formatWithPrecision(value: NormalizedUnitNumber, precision: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  return formatter.format(value.toNumber())
}
