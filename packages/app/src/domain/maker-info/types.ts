import BigNumber from 'bignumber.js'

import { NormalizedUnitNumber, Percentage } from '../types/NumericValues'

export interface MakerInfo {
  D3MCurrentDebtUSD: NormalizedUnitNumber
  maxDebtCeiling: NormalizedUnitNumber
  DSR: Percentage
  potParameters: PotParams
}

export interface PotParams {
  dsr: BigNumber
  rho: BigNumber
  chi: BigNumber
}
