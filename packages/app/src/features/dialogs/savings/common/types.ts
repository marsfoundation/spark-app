import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { TxOverviewRouteItem } from '../../common/types'

export interface TxOverview {
  baseStable: Token
  APY: Percentage
  stableEarnRate: NormalizedUnitNumber
  route: TxOverviewRouteItem[]
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
