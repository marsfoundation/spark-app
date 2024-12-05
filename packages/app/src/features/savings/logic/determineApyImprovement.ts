import { SavingsInfo } from '@/domain/savings-info/types'
import { Percentage } from '@marsfoundation/common-universal'

export interface DetermineApyImprovementParams {
  savingsUsdsInfo: SavingsInfo | null
  savingsDaiInfo: SavingsInfo | null
}

export function determineApyImprovement({
  savingsUsdsInfo,
  savingsDaiInfo,
}: DetermineApyImprovementParams): Percentage | undefined {
  if (!savingsUsdsInfo || !savingsDaiInfo) {
    return undefined
  }
  const apyDifference = savingsUsdsInfo.apy.minus(savingsDaiInfo.apy)
  return apyDifference.gt(0) ? Percentage(apyDifference) : undefined
}
