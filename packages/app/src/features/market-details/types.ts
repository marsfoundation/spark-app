import { EModeCategoryId } from '@/domain/e-mode/types'
import {
  BorrowEligibilityStatus,
  CollateralEligibilityStatus,
  SupplyAvailabilityStatus,
} from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

import { InterestYieldChartProps } from './components/charts/interest-yield/InterestYieldChart'

export interface SupplyReplacementInfo {
  token: Token
  totalSupplied: NormalizedUnitNumber
  supplyAPY: Percentage | undefined
}
export type CollateralStatusInfo = (
  | {
      status: Extract<CollateralEligibilityStatus, 'only-in-isolation-mode'>
      isolationModeInfo: {
        debt: NormalizedUnitNumber
        debtCeiling: NormalizedUnitNumber
      }
    }
  | {
      status: Exclude<CollateralEligibilityStatus, 'only-in-isolation-mode'>
    }
) & {
  token: Token
  maxLtv: Percentage
  liquidationThreshold: Percentage
  liquidationPenalty: Percentage
  supplyReplacement?: SupplyReplacementInfo
}
export interface MarketOverview {
  supply?: {
    hasSparkAirdrop: boolean
    status: SupplyAvailabilityStatus
    totalSupplied: NormalizedUnitNumber
    supplyCap?: NormalizedUnitNumber
    apy: Percentage | undefined
  }
  collateral: CollateralStatusInfo
  borrow: {
    hasSparkAirdrop: boolean
    status: BorrowEligibilityStatus
    totalBorrowed: NormalizedUnitNumber
    borrowCap?: NormalizedUnitNumber
    apy: Percentage | undefined
    reserveFactor: Percentage
    chartProps: InterestYieldChartProps
    showTokenBadge?: boolean
  }
  lend?: {
    status: 'yes' // only for dai
    token: Token
    totalLent: NormalizedUnitNumber
    apy: Percentage | undefined
  }
  eMode?: {
    maxLtv: Percentage
    liquidationThreshold: Percentage
    liquidationPenalty: Percentage
    categoryId: EModeCategoryId
    eModeCategoryTokens: TokenSymbol[]
    token?: Token
  }
  summary:
    | {
        type: 'default'
        marketSize: NormalizedUnitNumber
        borrowed: NormalizedUnitNumber
        available: NormalizedUnitNumber
        utilizationRate: Percentage
      }
    | {
        type: 'dai'
        marketSize: NormalizedUnitNumber
        borrowed: NormalizedUnitNumber
        instantlyAvailable: NormalizedUnitNumber
        makerDaoCapacity: NormalizedUnitNumber
        totalAvailable: NormalizedUnitNumber
        utilizationRate: Percentage
      }
}

export interface WalletOverview {
  guestMode: boolean
  token: Token
  tokenBalance: NormalizedUnitNumber
  lend?: {
    available: NormalizedUnitNumber
    token: Token
  }
  deposit: {
    available: NormalizedUnitNumber
    token: Token
  }
  borrow: {
    eligibility: BorrowEligibilityStatus
    available: NormalizedUnitNumber
    token: Token
  }
}
