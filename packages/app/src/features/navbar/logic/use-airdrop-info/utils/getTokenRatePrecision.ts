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
  const mostSignificantDigitPosition = Math.floor(Math.log10(ratePerRefreshInterval.toNumber()))
  return mostSignificantDigitPosition < 0 ? Math.abs(mostSignificantDigitPosition) : 0
}
