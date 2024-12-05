import { Incentive } from '@/domain/market-info/incentives'
import {
  BorrowEligibilityStatus,
  CollateralEligibilityStatus,
  ReserveStatus,
  SupplyAvailabilityStatus,
} from '@/domain/market-info/reserve-status'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'

export interface MarketStatus {
  supplyAvailabilityStatus: SupplyAvailabilityStatus
  collateralEligibilityStatus: CollateralEligibilityStatus
  borrowEligibilityStatus: BorrowEligibilityStatus
}

export interface MarketEntry {
  token: Token
  reserveStatus: ReserveStatus
  totalSupplied: NormalizedUnitNumber
  depositAPYDetails: APYDetails
  totalBorrowed: NormalizedUnitNumber
  borrowAPYDetails: APYDetails
  marketStatus: MarketStatus
}

export interface APYDetails {
  apy: Percentage | undefined
  incentives: Incentive[]
  airdrops: TokenSymbol[]
}
