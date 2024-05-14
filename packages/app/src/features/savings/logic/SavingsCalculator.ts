import { MarketInfo } from '@/domain/market-info/marketInfo'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { WalletInfo } from '@/domain/wallet/useWalletInfo'
import { bigNumberify } from '@/utils/bigNumber'

export abstract class SavingsCalculator<T> {
  abstract readonly apyParams: T
  readonly SECONDS_PER_DAY = 24 * 60 * 60
  private readonly marketInfo: MarketInfo
  private readonly walletInfo: WalletInfo
  private readonly timestamp: number
  private readonly whitelistedAssets: string[]

  constructor({
    marketInfo,
    walletInfo,
    timestamp,
    whitelistedAssets,
  }: {
    marketInfo: MarketInfo
    walletInfo: WalletInfo
    timestamp: number
    whitelistedAssets: string[]
  }) {
    this.marketInfo = marketInfo
    this.walletInfo = walletInfo
    this.timestamp = timestamp
    this.whitelistedAssets = whitelistedAssets
  }

  abstract convertSDaiToDai({ timestamp, timeProgress, sDai }: ConvertSDaiToDaiParams): NormalizedUnitNumber
  abstract convertDaiToSDai({ timestamp, timeProgress, dai }: ConvertDaiToSDaiParams): NormalizedUnitNumber

  private calculateProjections({ timestamp, sDaiBalance }: CalculateProjectionsParams): Projections {
    const base = this.convertSDaiToDai({ timestamp, timeProgress: 0, sDai: sDaiBalance })
    const thirtyDays = NormalizedUnitNumber(
      this.convertSDaiToDai({
        timestamp,
        timeProgress: 30 * this.SECONDS_PER_DAY,
        sDai: sDaiBalance,
      }).minus(base),
    )
    const oneYear = NormalizedUnitNumber(
      this.convertSDaiToDai({
        timestamp,
        timeProgress: 365 * this.SECONDS_PER_DAY,
        sDai: sDaiBalance,
      }).minus(base),
    )

    return {
      thirtyDays,
      oneYear,
    }
  }

  calculateCurrentProjections(): Projections {
    const sDaiBalance = this.walletInfo.findWalletBalanceForSymbol(TokenSymbol('sDAI'))
    return this.calculateProjections({
      timestamp: this.timestamp,
      sDaiBalance,
    })
  }

  calculateOpportunityProjections(): Projections {
    const assets = this.walletInfo.walletBalances.filter(({ token }) => this.whitelistedAssets.includes(token.symbol))
    const totalUSD = NormalizedUnitNumber(
      assets.reduce((acc, { token, balance }) => acc.plus(token.toUSD(balance)), bigNumberify('0')),
    )
    const DAI = this.marketInfo.findOneTokenBySymbol(TokenSymbol('DAI'))
    const potentialSDaiBalance = this.convertDaiToSDai({
      dai: NormalizedUnitNumber(totalUSD.dividedBy(DAI.unitPriceUsd)),
      timestamp: this.timestamp,
      timeProgress: 0,
    })

    return this.calculateProjections({
      timestamp: this.timestamp,
      sDaiBalance: potentialSDaiBalance,
    })
  }
}

export interface ConvertDaiToSDaiParams {
  timestamp: number
  timeProgress?: number
  dai: NormalizedUnitNumber
}

export interface ConvertSDaiToDaiParams {
  timestamp: number
  timeProgress?: number
  sDai: NormalizedUnitNumber
}

export interface CalculateProjectionsParams {
  timestamp: number
  sDaiBalance: NormalizedUnitNumber
}

export interface Projections {
  thirtyDays: NormalizedUnitNumber
  oneYear: NormalizedUnitNumber
}
