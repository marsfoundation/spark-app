import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { makeSavingsOverview } from '@/features/savings/logic/makeSavingsOverview'
import { calculateProjections } from '@/features/savings/logic/projections'
import { Projections } from '@/features/savings/types'
import { assert } from '@/utils/assert'
import { SavingsTokenDetails } from './useSavings'

export interface MakeSavingsTokenDetailsParams {
  savingsInfo: SavingsInfo | null
  savingsTokenWithBalance: TokenWithBalance | undefined
  baseToken: Token | undefined
  eligibleCashUSD: NormalizedUnitNumber
  timestamp: number
  timestampInMs: number
  stepInMs: number
}

export type MakeSavingsTokenDetailsResult =
  | (SavingsTokenDetails & { opportunityProjections: Projections; baseTokenSymbol: TokenSymbol })
  | undefined

export function makeSavingsTokenDetails({
  savingsInfo,
  savingsTokenWithBalance,
  baseToken,
  eligibleCashUSD,
  timestamp,
  timestampInMs,
  stepInMs,
}: MakeSavingsTokenDetailsParams): MakeSavingsTokenDetailsResult {
  if (!savingsInfo) {
    return undefined
  }

  assert(savingsTokenWithBalance, 'Savings token with balance should be defined when savings info is defined')
  assert(baseToken, 'Base token should be defined when savings info is defined')

  const { potentialShares, depositedUSD, depositedUSDPrecision } = makeSavingsOverview({
    savingsTokenWithBalance,
    savingsInfo,
    eligibleCashUSD,
    timestampInMs,
    stepInMs,
  })

  const currentProjections = calculateProjections({
    timestamp,
    shares: savingsTokenWithBalance.balance,
    savingsInfo,
  })
  const opportunityProjections = calculateProjections({
    timestamp,
    shares: potentialShares,
    savingsInfo,
  })

  return {
    APY: savingsInfo.apy,
    currentProjections,
    opportunityProjections,
    tokenWithBalance: savingsTokenWithBalance,
    baseTokenSymbol: baseToken.symbol,
    depositedUSD,
    depositedUSDPrecision,
  }
}
