import BigNumber from 'bignumber.js'

import { TokenWithValue } from '@/domain/common/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

export interface PositionSummary {
  deposits: TokenWithValue[]
  hasDeposits: boolean
  totalCollateralUSD: NormalizedUnitNumber
  healthFactor: BigNumber | undefined
  borrow: {
    current: NormalizedUnitNumber
    max: NormalizedUnitNumber
    percents: {
      borrowed: number
      rest: number
      max: number
    }
  }
}
