import BigNumber from 'bignumber.js'

import { Percentage } from '@/domain/types/NumericValues'

import { CollateralType } from './collateralization'

export interface PositionOverview {
  healthFactor: BigNumber | undefined
  collateralization: CollateralType
  supplyAPY: Percentage
}
