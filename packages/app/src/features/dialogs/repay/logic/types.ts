import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface PositionOverview {
  healthFactor: BigNumber | undefined
  debt: NormalizedUnitNumber
}
