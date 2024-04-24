import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { PositionOverview } from './types'

export interface MakeUpdatedPositionOverviewParams {
  healthFactor: BigNumber | undefined
  debt: NormalizedUnitNumber
}
export function makeUpdatedPositionOverview({
  healthFactor,
  debt,
}: MakeUpdatedPositionOverviewParams): PositionOverview {
  return {
    // @todo: change 1e-8 when repaying max is handled properly
    healthFactor: !healthFactor && debt.lt(1e-8) ? new BigNumber(Infinity) : healthFactor,
    debt,
  }
}
