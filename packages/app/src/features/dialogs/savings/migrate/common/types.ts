import { Percentage } from '@/domain/types/NumericValues'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'
import { TxOverviewResult } from '../../common/types'

export interface TxOverview {
  apyChange?: { current: Percentage; updated: Percentage }
  route: TxOverviewRouteItem[]
}

export type MigrateDialogTxOverview = TxOverviewResult<TxOverview>
