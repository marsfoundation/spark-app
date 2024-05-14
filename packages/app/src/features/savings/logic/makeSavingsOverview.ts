import { TokenWithBalance } from '@/domain/common/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { SavingsManager } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

const DEFAULT_PRECISION = 6

export interface MakeSavingsOverviewParams {
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  eligibleCashUSD: NormalizedUnitNumber
  savingsManager: SavingsManager
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
  savingsManager,
  timestampInMs,
  stepInMs,
}: MakeSavingsOverviewParams): SavingsOverview {
  const sDAI = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))
  const shares = walletInfo.findWalletBalanceForToken(sDAI)

  const [depositedUSD, precision] = calculateSharesToDaiWithPrecision({
    shares,
    savingsManager,
    timestampInMs,
    stepInMs,
  })

  const potentialShares = savingsManager.convertDaiToShares({ dai: eligibleCashUSD })

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
  savingsManager: SavingsManager
  timestampInMs: number
  stepInMs: number
}
function calculateSharesToDaiWithPrecision({
  shares,
  savingsManager,
  timestampInMs,
  stepInMs,
}: CalculateSharesToDaiWithPrecisionParams): [NormalizedUnitNumber, number] {
  if (!savingsManager.supportsRealTimeInterestAccrual) {
    return [savingsManager.convertSharesToDai({ shares }), DEFAULT_PRECISION]
  }

  const current = interpolateSharesToDai({ shares, savingsManager, timestampInMs })
  const next = interpolateSharesToDai({ shares, savingsManager, timestampInMs: timestampInMs + stepInMs })

  const precision = calculatePrecision({ current, next })

  return [current, precision]
}

interface InterpolateSharesToDaiParams {
  shares: NormalizedUnitNumber
  savingsManager: SavingsManager
  timestampInMs: number
}

function interpolateSharesToDai({
  shares,
  savingsManager,
  timestampInMs,
}: InterpolateSharesToDaiParams): NormalizedUnitNumber {
  const timestamp = Math.floor(timestampInMs / 1000)

  const now = savingsManager.predictSharesValue({ timestamp, shares })
  const inASecond = savingsManager.predictSharesValue({ timestamp: timestamp + 1, shares })

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
