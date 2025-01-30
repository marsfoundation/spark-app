import { NormalizedUnitNumber, Percentage, raise } from '@marsfoundation/common-universal'
import { QueryKey } from '@tanstack/react-query'
import { Config } from 'wagmi'
import { Token } from '../types/Token'
import { TokenSymbol } from '../types/TokenSymbol'

export interface SavingsInfo {
  predictAssetsAmount({ timestamp, shares }: { timestamp: number; shares: NormalizedUnitNumber }): NormalizedUnitNumber
  predictSharesAmount({ timestamp, assets }: { timestamp: number; assets: NormalizedUnitNumber }): NormalizedUnitNumber
  convertToShares({ assets }: { assets: NormalizedUnitNumber }): NormalizedUnitNumber
  convertToAssets({ shares }: { shares: NormalizedUnitNumber }): NormalizedUnitNumber
  apy: Percentage
  supportsRealTimeInterestAccrual: boolean
  readonly currentTimestamp: number
}

export interface SavingsInfoQueryParams {
  wagmiConfig: Config
  chainId: number
  timestamp: number
}

export interface SavingsInfoQueryOptions {
  queryKey: QueryKey
  queryFn: () => Promise<SavingsInfo | null>
}

export interface InterestBearingConverter {
  predictAssetsAmount({ timestamp, shares }: { timestamp: number; shares: NormalizedUnitNumber }): NormalizedUnitNumber
  predictSharesAmount({ timestamp, assets }: { timestamp: number; assets: NormalizedUnitNumber }): NormalizedUnitNumber
  convertToShares({ assets }: { assets: NormalizedUnitNumber }): NormalizedUnitNumber
  convertToAssets({ shares }: { shares: NormalizedUnitNumber }): NormalizedUnitNumber
  apy: Percentage
  supportsRealTimeInterestAccrual: boolean
  readonly currentTimestamp: number
}

export interface SavingsAccount {
  converter: InterestBearingConverter
  savingsToken: Token
  underlyingToken: Token
}

export class SavingsAccountRepository {
  constructor(private readonly accounts: SavingsAccount[]) {}

  all(): SavingsAccount[] {
    return this.accounts
  }

  findAccountBySavingsTokenSymbol(savingsTokenSymbol: TokenSymbol): SavingsAccount | undefined {
    return this.accounts.find((account) => account.savingsToken.symbol === savingsTokenSymbol)
  }

  findOneAccountBySavingsTokenSymbol(savingsTokenSymbol: TokenSymbol): SavingsAccount {
    return (
      this.findAccountBySavingsTokenSymbol(savingsTokenSymbol) ??
      raise(`Savings account not found for ${savingsTokenSymbol}`)
    )
  }

  findAccountBySavingsToken(savingsToken: Token): SavingsAccount | undefined {
    return this.findAccountBySavingsTokenSymbol(savingsToken.symbol)
  }

  findOneAccountBySavingsToken(savingsToken: Token): SavingsAccount {
    return this.findOneAccountBySavingsTokenSymbol(savingsToken.symbol)
  }
}
