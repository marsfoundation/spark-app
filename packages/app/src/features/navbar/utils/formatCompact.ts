import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export function formatCompact(value: NormalizedUnitNumber): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(value.toNumber())
}
