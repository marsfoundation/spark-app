import { TokenWithBalance } from '@/domain/common/types'
import { SavingsInfo } from '@/domain/savings-info/types'
import { Token } from '@/domain/types/Token'
import { STEP_IN_MS, SavingsOverview, makeSavingsOverview } from './makeSavingsOverview'
import { calculateProjections } from './projections'
import { SavingsTokenDetails } from './useSavings'

export interface MakeSavingsTokenDetailsParams {
  savingsInfo: SavingsInfo | null
  assetsToken: Token | undefined
  savingsTokenWithBalance: TokenWithBalance | undefined
  timestamp: number
}

export type MakeSavingsTokenDetailsResult = SavingsTokenDetails | undefined

export function makeSavingsTokenDetails({
  savingsInfo,
  assetsToken,
  savingsTokenWithBalance,
  timestamp,
}: MakeSavingsTokenDetailsParams): MakeSavingsTokenDetailsResult {
  if (!savingsInfo || !savingsTokenWithBalance || !assetsToken) {
    return undefined
  }

  const currentProjections = calculateProjections({
    timestamp,
    shares: savingsTokenWithBalance.balance,
    savingsInfo,
  })

  const balanceRefreshIntervalInMs = savingsInfo.supportsRealTimeInterestAccrual ? STEP_IN_MS : undefined
  const calculateSavingsBalance = calculateSavingsBalanceFactory(savingsInfo, savingsTokenWithBalance)

  return {
    APY: savingsInfo.apy,
    currentProjections,
    savingsTokenWithBalance,
    assetsToken,
    calculateSavingsBalance,
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
