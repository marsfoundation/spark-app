import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assert } from '@/utils/assert'
import { Projections } from '../types'
import { makeSavingsOverview } from './makeSavingsOverview'
import { calculateProjections } from './projections'
import { SavingsTokenDetails } from './useSavings'

export interface MakeSavingsTokenDetailsParams {
  savingsInfo: SavingsInfo | null
  savingsTokenWithBalance: TokenWithBalance | undefined
  eligibleCashUSD: NormalizedUnitNumber
  timestamp: number
  timestampInMs: number
  stepInMs: number
}

export type MakeSavingsTokenDetailsResult = (SavingsTokenDetails & { opportunityProjections: Projections }) | undefined

export function makeSavingsTokenDetails({
  savingsInfo,
  savingsTokenWithBalance,
  eligibleCashUSD,
  timestamp,
  timestampInMs,
  stepInMs,
}: MakeSavingsTokenDetailsParams): MakeSavingsTokenDetailsResult {
  if (!savingsInfo) {
    return undefined
  }

  assert(savingsTokenWithBalance, 'Savings token with balance should be defined when savings info is defined')

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
    depositedUSD,
    depositedUSDPrecision,
  }
}
