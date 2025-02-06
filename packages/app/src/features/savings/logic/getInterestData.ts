import { TokenWithBalance } from '@/domain/common/types'
import { SavingsConverter } from '@/domain/savings-converters/types'
import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { STEP_IN_MS, SavingsOverview, makeSavingsOverview } from './makeSavingsOverview'
import { calculateOneYearProjection } from './projections'
import { InterestData } from './useSavings'

export interface GetInterestDataParams {
  savingsConverter: SavingsConverter
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  timestamp: number
}

export type MakeSavingsTokenDetailsResult = InterestData | undefined

export function getInterestData({
  savingsConverter,
  savingsToken,
  savingsTokenBalance,
  timestamp,
}: GetInterestDataParams): InterestData {
  const oneYearProjection = calculateOneYearProjection({
    timestamp,
    shares: savingsTokenBalance,
    savingsConverter,
  })

  const balanceRefreshIntervalInMs = savingsConverter.supportsRealTimeInterestAccrual ? STEP_IN_MS : undefined
  const calculateUnderlyingTokenBalance = calculateSavingsBalanceFactory(savingsConverter, {
    token: savingsToken,
    balance: savingsTokenBalance,
  })

  return {
    APY: savingsConverter.apy,
    oneYearProjection,
    calculateUnderlyingTokenBalance,
    balanceRefreshIntervalInMs,
  }
}

function calculateSavingsBalanceFactory(savingsConverter: SavingsConverter, savingsTokenWithBalance: TokenWithBalance) {
  return function calculateSavingsBalance(timestampInMs: number): SavingsOverview {
    return makeSavingsOverview({
      timestampInMs,
      savingsTokenWithBalance,
      savingsConverter,
    })
  }
}
