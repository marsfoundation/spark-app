import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

export interface PositionOverview {
  healthFactor: BigNumber | undefined
  tokenSupply: NormalizedUnitNumber
  supplyAPY: Percentage
}
