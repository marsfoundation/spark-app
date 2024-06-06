import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { getTokenRatePerInterval } from './getTokenRatePerInterval'

export interface ExtendAirdropResponseParams {
  tokenRatePerSecond: NormalizedUnitNumber
  refreshIntervalInMs: number
}

export function getTokenRatePrecision({
  tokenRatePerSecond,
  refreshIntervalInMs,
}: ExtendAirdropResponseParams): number {
  const ratePerRefreshInterval = getTokenRatePerInterval({ tokenRatePerSecond, refreshIntervalInMs })
  if (ratePerRefreshInterval.isZero()) {
    return 0
  }
  const mostSignificantDigitPosition = Math.min(Math.floor(Math.log10(ratePerRefreshInterval.toNumber())), 18)
  return mostSignificantDigitPosition < 0 ? Math.abs(mostSignificantDigitPosition) : 0
}
