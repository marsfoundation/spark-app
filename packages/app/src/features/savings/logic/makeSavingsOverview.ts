import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

const DEFAULT_PRECISION = 6
export const STEP_IN_MS = 50

export interface MakeSavingsOverviewParams {
  savingsTokenWithBalance: TokenWithBalance
  savingsInfo: SavingsInfo
  timestampInMs: number
}
export interface SavingsOverview {
  depositedAssets: NormalizedUnitNumber
  depositedAssetsPrecision: number
}

export function makeSavingsOverview({
  savingsTokenWithBalance,
  savingsInfo,
  timestampInMs,
}: MakeSavingsOverviewParams): SavingsOverview {
  const [assets, precision] = convertSharesToAssetsWithPrecision({
    shares: savingsTokenWithBalance.balance,
    savingsInfo,
    timestampInMs,
  })

  return {
    depositedAssets: assets,
    depositedAssetsPrecision: precision,
  }
}

interface ConvertSharesToAssetsWithPrecisionParams {
  shares: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timestampInMs: number
}
function convertSharesToAssetsWithPrecision({
  shares,
  savingsInfo,
  timestampInMs,
}: ConvertSharesToAssetsWithPrecisionParams): [NormalizedUnitNumber, number] {
  if (!savingsInfo.supportsRealTimeInterestAccrual) {
    return [savingsInfo.convertToAssets({ shares }), DEFAULT_PRECISION]
  }

  const current = interpolateSharesToAssets({ shares, savingsInfo, timestampInMs })
  const next = interpolateSharesToAssets({ shares, savingsInfo, timestampInMs: timestampInMs + STEP_IN_MS })

  const precision = calculatePrecision({ current, next })

  return [current, precision]
}

interface InterpolateSharesToAssetsParams {
  shares: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timestampInMs: number
}

function interpolateSharesToAssets({
  shares,
  savingsInfo,
  timestampInMs,
}: InterpolateSharesToAssetsParams): NormalizedUnitNumber {
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
