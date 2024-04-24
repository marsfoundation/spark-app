import { TokenWithBalance } from '@/domain/common/types'
import { PotParams } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { convertDaiToShares, convertSharesToDai } from './projections'

export interface MakeSavingsOverviewParams {
  marketInfo: MarketInfo
  walletInfo: WalletInfo
  eligibleCashUSD: NormalizedUnitNumber
  potParams: PotParams
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
  timestampInMs,
  stepInMs,
  potParams,
}: MakeSavingsOverviewParams): SavingsOverview {
  const timestamp = Math.floor(timestampInMs / 1000)
  const sDAI = marketInfo.findOneTokenBySymbol(TokenSymbol('sDAI'))
  const DAI = marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))
  const shares = walletInfo.findWalletBalanceForToken(sDAI)

  const [depositedUSD, precision] = calculateSharesToDaiWithPrecision({
    shares,
    potParams,
    timestampInMs,
    stepInMs,
  })

  const potentialShares = convertDaiToShares({
    dai: NormalizedUnitNumber(eligibleCashUSD.dividedBy(DAI.unitPriceUsd)),
    timestamp,
    potParams,
  })

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
  potParams: PotParams
  timestampInMs: number
  stepInMs: number
}
function calculateSharesToDaiWithPrecision({
  shares,
  potParams,
  timestampInMs,
  stepInMs,
}: CalculateSharesToDaiWithPrecisionParams): [NormalizedUnitNumber, number] {
  const current = interpolateSharesToDai({ shares, potParams, timestampInMs })
  const next = interpolateSharesToDai({ shares, potParams, timestampInMs: timestampInMs + stepInMs })

  const precision = calculatePrecision({ current, next })

  return [current, precision]
}

interface InterpolateSharesToDaiParams {
  shares: NormalizedUnitNumber
  potParams: PotParams
  timestampInMs: number
}

function interpolateSharesToDai({
  shares,
  potParams,
  timestampInMs,
}: InterpolateSharesToDaiParams): NormalizedUnitNumber {
  const timestamp = Math.floor(timestampInMs / 1000)

  const now = convertSharesToDai({ timestamp, shares, potParams })
  const inASecond = convertSharesToDai({ timestamp: timestamp + 1, shares, potParams })

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
