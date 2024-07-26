import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { MarketWalletInfo } from '@/domain/wallet/useMarketWalletInfo'

const DEFAULT_PRECISION = 6

export interface MakeSavingsOverviewParams {
  marketInfo: MarketInfo
  walletInfo: MarketWalletInfo
  eligibleCashUSD: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timestampInMs: number
  stepInMs: number
}
export interface SavingsOverview {
  shares: NormalizedUnitNumber
  potentialShares: NormalizedUnitNumber
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
  sDAIBalance: TokenWithBalance
}

export function makeSavingsOverview({
  marketInfo,
  walletInfo,
  eligibleCashUSD,
  savingsInfo,
  timestampInMs,
  stepInMs,
}: MakeSavingsOverviewParams): SavingsOverview {
  const sDAI = marketInfo.sDAI
  const shares = walletInfo.findWalletBalanceForToken(sDAI)

  const [depositedUSD, precision] = calculateSharesToDaiWithPrecision({
    shares,
    savingsInfo,
    timestampInMs,
    stepInMs,
  })

  const potentialShares = savingsInfo.convertDaiToShares({ dai: eligibleCashUSD })

  const sDAIBalance = { token: sDAI, balance: walletInfo.findWalletBalanceForToken(sDAI) }

  return {
    shares,
    potentialShares,
    depositedUSD,
    depositedUSDPrecision: precision,
    sDAIBalance,
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
    return [savingsInfo.convertSharesToDai({ shares }), DEFAULT_PRECISION]
  }

  const current = interpolateSharesToDai({ shares, savingsInfo, timestampInMs })
  const next = interpolateSharesToDai({ shares, savingsInfo, timestampInMs: timestampInMs + stepInMs })

  const precision = calculatePrecision({ current, next })

  return [current, precision]
}

interface InterpolateSharesToDaiParams {
  shares: NormalizedUnitNumber
  savingsInfo: SavingsInfo
  timestampInMs: number
}

function interpolateSharesToDai({
  shares,
  savingsInfo,
  timestampInMs,
}: InterpolateSharesToDaiParams): NormalizedUnitNumber {
  const timestamp = Math.floor(timestampInMs / 1000)

  const now = savingsInfo.predictSharesValue({ timestamp, shares })
  const inASecond = savingsInfo.predictSharesValue({ timestamp: timestamp + 1, shares })

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
