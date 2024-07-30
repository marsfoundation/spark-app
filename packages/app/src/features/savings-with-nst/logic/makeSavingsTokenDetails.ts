import { SavingsInfoWithBalance } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { makeSavingsOverview } from '@/features/savings/logic/makeSavingsOverview'
import { calculateProjections } from '@/features/savings/logic/projections'
import { SavingsTokenDetails } from './useSavings'

interface MakeSavingsTokenDetailsParams {
  savingsInfo: SavingsInfoWithBalance | null
  eligibleCashUSD: NormalizedUnitNumber
  timestamp: number
  timestampInMs: number
  stepInMs: number
}

export function makeSavingsTokenDetails({
  savingsInfo,
  eligibleCashUSD,
  timestamp,
  timestampInMs,
  stepInMs,
}: MakeSavingsTokenDetailsParams): SavingsTokenDetails | undefined {
  if (!savingsInfo) {
    return undefined
  }

  const { potentialShares, depositedUSD, depositedUSDPrecision } = makeSavingsOverview({
    savingsTokenWithBalance: savingsInfo.savingsTokenWithBalance,
    savingsInfo,
    eligibleCashUSD,
    timestampInMs,
    stepInMs,
  })

  const currentProjections = calculateProjections({
    timestamp,
    shares: savingsInfo.savingsTokenWithBalance.balance,
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
    tokenWithBalance: savingsInfo.savingsTokenWithBalance,
    depositedUSD,
    depositedUSDPrecision,
  }
}
