import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface RouteItem {
  token: Token
  value: NormalizedUnitNumber
  usdValue: NormalizedUnitNumber
}

export interface TxOverview {
  baseStable: Token
  APY: Percentage
  stableEarnRate: NormalizedUnitNumber
  route: RouteItem[]
  skyBadgeToken: Token
  outTokenAmount: NormalizedUnitNumber
}

export type TxOverviewResult<T extends {}> =
  | {
      status: 'no-overview'
    }
  | ({
      status: 'success'
    } & T)

export type SavingsDialogTxOverview = TxOverviewResult<TxOverview>
