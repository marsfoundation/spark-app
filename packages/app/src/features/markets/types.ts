import { Incentive } from '@/domain/market-info/incentives'
import {
  BorrowEligibilityStatus,
  CollateralEligibilityStatus,
  ReserveStatus,
  SupplyAvailabilityStatus,
} from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'

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
  apy: Percentage
  incentives: Incentive[]
  airdrops: TokenSymbol[]
}
