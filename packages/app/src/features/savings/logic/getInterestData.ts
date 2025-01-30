import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { STEP_IN_MS, SavingsOverview, makeSavingsOverview } from './makeSavingsOverview'
import { calculateProjections } from './projections'
import { InterestData } from './useSavings'

export interface GetInterestDataParams {
  savingsInfo: SavingsInfo
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  timestamp: number
}

export type MakeSavingsTokenDetailsResult = InterestData | undefined

export function getInterestData({
  savingsInfo,
  savingsToken,
  savingsTokenBalance,
  timestamp,
}: GetInterestDataParams): InterestData {
  const currentProjections = calculateProjections({
    timestamp,
    shares: savingsTokenBalance,
    savingsInfo,
  })

  const balanceRefreshIntervalInMs = savingsInfo.supportsRealTimeInterestAccrual ? STEP_IN_MS : undefined
  const calculateUnderlyingTokenBalance = calculateSavingsBalanceFactory(savingsInfo, {
    token: savingsToken,
    balance: savingsTokenBalance,
  })

  return {
    APY: savingsInfo.apy,
    currentProjections,
    calculateUnderlyingTokenBalance,
    balanceRefreshIntervalInMs,
  }
}

function calculateSavingsBalanceFactory(savingsInfo: SavingsInfo, savingsTokenWithBalance: TokenWithBalance) {
  return function calculateSavingsBalance(timestampInMs: number): SavingsOverview {
    return makeSavingsOverview({
      timestampInMs,
      savingsTokenWithBalance,
      savingsInfo,
    })
  }
}
