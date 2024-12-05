import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

export interface PositionOverview {
  healthFactor: BigNumber | undefined
  tokenSupply: NormalizedUnitNumber
  supplyAPY: Percentage | undefined
}
