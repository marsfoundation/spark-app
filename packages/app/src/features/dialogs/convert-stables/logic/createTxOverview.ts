import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'

export interface CreateTxOverviewParams {
  from: Token
  to: Token
  amount: NormalizedUnitNumber
}

export type TxOverview =
  | { status: 'no-overview' }
  | { status: 'success'; route: TxOverviewRouteItem[]; outcome: TxOverviewRouteItem }

export function createTxOverview({ from, to, amount }: CreateTxOverviewParams): TxOverview {
  const outcome = {
    token: to,
    value: amount,
    usdValue: to.toUSD(amount),
  }

  const route = [
    {
      token: from,
      value: amount,
      usdValue: from.toUSD(amount),
    },
    outcome,
  ]

  return {
    status: 'success',
    route,
    outcome,
  }
}
