import { SavingsConverter } from '@/domain/savings-converters/types'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

import { Projections } from '../types'

const SECONDS_PER_DAY = 24 * 60 * 60

export interface CalculateProjectionsParams {
  timestamp: number // in seconds
  shares: NormalizedUnitNumber
  savingsConverter: SavingsConverter
}
export function calculateProjections({ timestamp, shares, savingsConverter }: CalculateProjectionsParams): Projections {
  const base = savingsConverter.convertToAssets({ shares })
  const thirtyDays = NormalizedUnitNumber(
    savingsConverter.predictAssetsAmount({ timestamp: timestamp + 30 * SECONDS_PER_DAY, shares }).minus(base),
  )
  const oneYear = NormalizedUnitNumber(
    savingsConverter.predictAssetsAmount({ timestamp: timestamp + 365 * SECONDS_PER_DAY, shares }).minus(base),
  )

  return {
    thirtyDays,
    oneYear,
  }
}
