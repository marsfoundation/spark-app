import { PotParams } from '@/domain/maker-info/types'
import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { bigNumberify } from '@/utils/bigNumber'
import { fromRay, pow } from '@/utils/math'

import { ConvertDaiToSDaiParams, ConvertSDaiToDaiParams, SavingsCalculator } from './SavingsCalculator'

export class MainnetSavingsCalculator extends SavingsCalculator<PotParams> {
  readonly apyParams: PotParams

  constructor({
    marketInfo,
    walletInfo,
    timestamp,
    apyParams,
    whitelistedAssets,
  }: {
    marketInfo: MarketInfo
    walletInfo: WalletInfo
    timestamp: number
    apyParams: PotParams
    whitelistedAssets: string[]
  }) {
    super({ marketInfo, walletInfo, timestamp, whitelistedAssets })
    this.apyParams = apyParams
  }

  convertSDaiToDai({ timestamp, timeProgress = 0, sDai }: ConvertSDaiToDaiParams): NormalizedUnitNumber {
    const { dsr, rho, chi } = this.apyParams
    const updatedChi = fromRay(pow(fromRay(dsr), bigNumberify(timestamp + timeProgress).minus(rho)).multipliedBy(chi))
    return NormalizedUnitNumber(sDai.multipliedBy(updatedChi))
  }

  convertDaiToSDai({ timestamp, timeProgress = 0, dai }: ConvertDaiToSDaiParams): NormalizedUnitNumber {
    const { dsr, rho, chi } = this.apyParams
    const updatedChi = fromRay(pow(fromRay(dsr), bigNumberify(timestamp + timeProgress).minus(rho)).multipliedBy(chi))
    return NormalizedUnitNumber(dai.dividedBy(updatedChi))
  }
}
