import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface GetTokenRatePerIntervalParams {
  tokenRatePerSecond: NormalizedUnitNumber
  refreshIntervalInMs: number
}

export function getTokenRatePerInterval({
  tokenRatePerSecond,
  refreshIntervalInMs,
}: GetTokenRatePerIntervalParams): NormalizedUnitNumber {
  return NormalizedUnitNumber(tokenRatePerSecond.dividedBy(1000 / refreshIntervalInMs))
}
