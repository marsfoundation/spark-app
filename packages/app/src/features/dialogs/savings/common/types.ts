import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

export interface RouteItem {
  token: Token
  value: NormalizedUnitNumber
  usdValue: NormalizedUnitNumber
}

export interface TxOverviewMaker {
  APY: Percentage
  daiEarnRate: NormalizedUnitNumber
  route: RouteItem[]
  makerBadgeToken: Token
  outTokenAmount: NormalizedUnitNumber
}
export interface TxOverviewLiFi {
  exchangeRatioFromToken: Token
  exchangeRatioToToken: Token
  exchangeRatio: NormalizedUnitNumber
  sDaiToken: Token
  sDaiBalanceBefore: NormalizedUnitNumber
  sDaiBalanceAfter: NormalizedUnitNumber
  APY: Percentage
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

export type SavingsDialogTxOverviewMaker = { type: 'maker' } & TxOverviewResult<TxOverviewMaker>
export type SavingsDialogTxOverviewLiFi = { type: 'lifi'; showExchangeRate: boolean } & TxOverviewResult<TxOverviewLiFi>

export type SavingsDialogTxOverview = SavingsDialogTxOverviewMaker | SavingsDialogTxOverviewLiFi
