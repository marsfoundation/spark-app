import { Percentage } from '@/domain/types/NumericValues'
import { RouteItem, TxOverviewResult } from '../../common/types'

export interface TxOverview {
  apyChange?: { old: Percentage; new: Percentage }
  route: RouteItem[]
}

export type MigrateDialogTxOverview = TxOverviewResult<TxOverview>
