import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { makeSavingsOverview } from '@/features/savings/logic/makeSavingsOverview'
import { calculateProjections } from '@/features/savings/logic/projections'
import { assert } from '@/utils/assert'
import { SavingsTokenDetails } from './useSavings'

interface MakeSavingsTokenDetailsParams {
  savingsInfo: SavingsInfo | null
  savingsTokenWithBalance: TokenWithBalance | undefined
  eligibleCashUSD: NormalizedUnitNumber
  timestamp: number
  timestampInMs: number
  stepInMs: number
}

export function makeSavingsTokenDetails({
  savingsInfo,
  savingsTokenWithBalance,
  eligibleCashUSD,
  timestamp,
  timestampInMs,
  stepInMs,
}: MakeSavingsTokenDetailsParams): SavingsTokenDetails | undefined {
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
