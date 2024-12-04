import { bigNumberify } from '@/utils/bigNumber'
import { fromRay, pow } from '@/utils/math'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import BigNumber from 'bignumber.js'
import { SavingsInfo } from './types'

export interface PotParams {
  dsr: BigNumber
  rho: BigNumber
  chi: BigNumber
}
export interface PotSavingsInfoParams {
  potParams: PotParams
  currentTimestamp: number
}

export class PotSavingsInfo implements SavingsInfo {
  readonly DSR: Percentage
  readonly potParams: PotParams
  readonly currentTimestamp: number

  constructor({ potParams, currentTimestamp }: PotSavingsInfoParams) {
    this.potParams = potParams
    this.currentTimestamp = currentTimestamp
    this.DSR = Percentage(pow(fromRay(potParams.dsr), 60 * 60 * 24 * 365).minus(1), true)
  }

  get apy(): Percentage {
    return this.DSR
  }

  get supportsRealTimeInterestAccrual(): boolean {
    return true
  }

  private getUpdatedChi(timestamp: number): BigNumber {
    const { dsr, rho, chi } = this.potParams
    return fromRay(pow(fromRay(dsr), bigNumberify(timestamp).minus(rho)).multipliedBy(chi))
  }

  convertToShares({ assets }: { assets: NormalizedUnitNumber }): NormalizedUnitNumber {
    return this.predictSharesAmount({ timestamp: this.currentTimestamp, assets })
  }

  convertToAssets({ shares }: { shares: NormalizedUnitNumber }): NormalizedUnitNumber {
    return this.predictAssetsAmount({ timestamp: this.currentTimestamp, shares })
  }

  predictAssetsAmount({
    timestamp,
    shares,
  }: { timestamp: number; shares: NormalizedUnitNumber }): NormalizedUnitNumber {
    const updatedChi = this.getUpdatedChi(timestamp)
    return NormalizedUnitNumber(shares.multipliedBy(updatedChi))
  }

  predictSharesAmount({
    timestamp,
    assets,
  }: { timestamp: number; assets: NormalizedUnitNumber }): NormalizedUnitNumber {
    const updatedChi = this.getUpdatedChi(timestamp)
    return NormalizedUnitNumber(assets.dividedBy(updatedChi))
  }
}
