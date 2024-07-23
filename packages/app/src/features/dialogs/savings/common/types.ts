import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface RouteItem {
  token: Token
  value: NormalizedUnitNumber
  usdValue: NormalizedUnitNumber
}

export interface TxOverview {
  dai: Token
  APY: Percentage
  daiEarnRate: NormalizedUnitNumber
  route: RouteItem[]
  makerBadgeToken: Token
  outTokenAmount: NormalizedUnitNumber
}

type TxOverviewResult<T extends {}> =
  | {
      status: 'loading'
    }
  | {
      status: 'no-overview'
    }
  | ({
      status: 'success'
    } & T)

export type SavingsDialogTxOverview = TxOverviewResult<TxOverview>
