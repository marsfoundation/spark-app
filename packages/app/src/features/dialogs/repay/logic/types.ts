import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

export interface PositionOverview {
  healthFactor: BigNumber | undefined
  debt: NormalizedUnitNumber
}
