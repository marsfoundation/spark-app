import { SavingsInfo } from '@/domain/savings-info/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

import { Projections } from '../types'

const SECONDS_PER_DAY = 24 * 60 * 60

export interface CalculateProjectionsParams {
  timestamp: number // in seconds
  shares: NormalizedUnitNumber
  savingsInfo: SavingsInfo
}
export function calculateProjections({ timestamp, shares, savingsInfo }: CalculateProjectionsParams): Projections {
  const base = savingsInfo.convertToAssets({ shares })
  const thirtyDays = NormalizedUnitNumber(
    savingsInfo.predictAssetsAmount({ timestamp: timestamp + 30 * SECONDS_PER_DAY, shares }).minus(base),
  )
  const oneYear = NormalizedUnitNumber(
    savingsInfo.predictAssetsAmount({ timestamp: timestamp + 365 * SECONDS_PER_DAY, shares }).minus(base),
  )

  return {
    thirtyDays,
    oneYear,
  }
}
