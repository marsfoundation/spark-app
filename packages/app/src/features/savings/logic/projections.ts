import { SavingsManager } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { Projections } from '../types'

const SECONDS_PER_DAY = 24 * 60 * 60

export interface CalculateProjectionsParams {
  timestamp: number // in seconds
  shares: NormalizedUnitNumber
  savingsManager: SavingsManager
}
export function calculateProjections({ timestamp, shares, savingsManager }: CalculateProjectionsParams): Projections {
  const base = savingsManager.convertSharesToDai({ shares })
  const thirtyDays = NormalizedUnitNumber(
    savingsManager.predictSharesValue({ timestamp: timestamp + 30 * SECONDS_PER_DAY, shares }).minus(base),
  )
  const oneYear = NormalizedUnitNumber(
    savingsManager.predictSharesValue({ timestamp: timestamp + 365 * SECONDS_PER_DAY, shares }).minus(base),
  )

  return {
    thirtyDays,
    oneYear,
  }
}
