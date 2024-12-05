import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { QueryKey } from '@tanstack/react-query'
import { Config } from 'wagmi'

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
