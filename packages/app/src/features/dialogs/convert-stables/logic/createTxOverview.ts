import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TxOverviewRouteItem } from '@/features/dialogs/common/types'

export interface CreateTxOverviewParams {
  inToken: Token
  outToken: Token
  amount: NormalizedUnitNumber
}

export type TxOverview =
  | { status: 'no-overview' }
  | { status: 'success'; route: TxOverviewRouteItem[]; inToken: Token; outcome: TxOverviewRouteItem }

export function createTxOverview({ inToken, outToken, amount }: CreateTxOverviewParams): TxOverview {
  const outcome = {
    token: outToken,
    value: amount,
    usdValue: outToken.toUSD(amount),
  }

  const route = [
    {
      token: inToken,
      value: amount,
      usdValue: inToken.toUSD(amount),
    },
    outcome,
  ]

  return {
    status: 'success',
    route,
    inToken,
    outcome,
  }
}
