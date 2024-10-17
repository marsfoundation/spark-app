import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

const DEFAULT_PRECISION = 6

export interface MakeSavingsOverviewParams {
  savingsTokenWithBalance: TokenWithBalance
  savingsInfo: SavingsInfo
  timestampInMs: number
  stepInMs: number
}
export interface SavingsOverview {
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
}

export function makeSavingsOverview({
  savingsTokenWithBalance,
  savingsInfo,
  timestampInMs,
  stepInMs,
}: MakeSavingsOverviewParams): SavingsOverview {
  const [depositedUSD, precision] = calculateSharesToDaiWithPrecision({
    shares: savingsTokenWithBalance.balance,
    savingsInfo,
    timestampInMs,
    stepInMs,
  })

  return {
    depositedUSD,
    depositedUSDPrecision: precision,
  }
}

interface CalculateSharesToDaiWithPrecisionParams {
  shares: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timestampInMs: number
  stepInMs: number
}
function calculateSharesToDaiWithPrecision({
  shares,
  savingsInfo,
  timestampInMs,
  stepInMs,
}: CalculateSharesToDaiWithPrecisionParams): [NormalizedUnitNumber, number] {
  if (!savingsInfo.supportsRealTimeInterestAccrual) {
    return [savingsInfo.convertToAssets({ shares }), DEFAULT_PRECISION]
  }

  const current = interpolateSharesToAssets({ shares, savingsInfo, timestampInMs })
  const next = interpolateSharesToAssets({ shares, savingsInfo, timestampInMs: timestampInMs + stepInMs })

  const precision = calculatePrecision({ current, next })

  return [current, precision]
}

interface InterpolateSharesToDaiParams {
  shares: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timestampInMs: number
}

function interpolateSharesToAssets({
  shares,
  savingsInfo,
  timestampInMs,
}: InterpolateSharesToDaiParams): NormalizedUnitNumber {
  const timestamp = Math.floor(timestampInMs / 1000)

  const now = savingsInfo.predictAssetsAmount({ timestamp, shares })
  const inASecond = savingsInfo.predictAssetsAmount({ timestamp: timestamp + 1, shares })

  const linearApproximation = NormalizedUnitNumber(now.plus(inASecond.minus(now).times((timestampInMs % 1000) / 1000)))
  return linearApproximation
}

interface CalculatePrecisionParams {
  current: NormalizedUnitNumber
  next: NormalizedUnitNumber
}
function calculatePrecision({ current, next }: CalculatePrecisionParams): number {
  const diff = next.minus(current)
  if (diff.lt(1e-12)) {
    return 12
  }

  return Math.max(-Math.floor(Math.log10(diff.toNumber())), 0)
}
