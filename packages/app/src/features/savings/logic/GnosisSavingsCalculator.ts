import { MarketInfo } from '@/domain/market-info/marketInfo'
import { ConversionParams } from '@/domain/savings-apy/gnosisSavingsAPY'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'

import { ConvertDaiToSDaiParams, ConvertSDaiToDaiParams, SavingsCalculator } from './SavingsCalculator'

export class GnosisSavingsCalculator extends SavingsCalculator<ConversionParams> {
  readonly apyParams: ConversionParams

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
    apyParams: ConversionParams
    whitelistedAssets: string[]
  }) {
    super({ marketInfo, walletInfo, timestamp, whitelistedAssets })
    this.apyParams = apyParams
  }

  private calculateGrownInterests({ timeProgress = 0 }: { timeProgress: number }): NormalizedUnitNumber {
    const { totalSupply, vaultAPY } = this.apyParams
    const growthFactor = vaultAPY.dividedBy(365 * this.SECONDS_PER_DAY)
    return NormalizedUnitNumber(totalSupply.multipliedBy(growthFactor).multipliedBy(timeProgress))
  }

  convertSDaiToDai({ timeProgress = 0, sDai }: ConvertSDaiToDaiParams): NormalizedUnitNumber {
    const { totalAssets, totalSupply } = this.apyParams
    const grownInterests = this.calculateGrownInterests({ timeProgress })
    return NormalizedUnitNumber(sDai.multipliedBy(totalAssets.plus(1).plus(grownInterests)).dividedBy(totalSupply))
  }

  convertDaiToSDai({ timeProgress = 0, dai }: ConvertDaiToSDaiParams): NormalizedUnitNumber {
    const { totalAssets, totalSupply } = this.apyParams
    const grownInterests = this.calculateGrownInterests({ timeProgress })
    return NormalizedUnitNumber(dai.multipliedBy(totalSupply).dividedBy(totalAssets.plus(1).plus(grownInterests)))
  }
}
