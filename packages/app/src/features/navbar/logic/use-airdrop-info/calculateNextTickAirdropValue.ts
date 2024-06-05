import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export function calculateNextTickAirdropValue(
  currentValue: NormalizedUnitNumber,
  tokenRatePerSecond: NormalizedUnitNumber,
  refreshIntervalInMs: number,
) {
  const toAdd = tokenRatePerSecond.dividedBy(1000 / refreshIntervalInMs)
  return NormalizedUnitNumber(currentValue.plus(toAdd))
}
