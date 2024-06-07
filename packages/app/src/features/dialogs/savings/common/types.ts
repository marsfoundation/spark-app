import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

interface TxOverview {
  exchangeRatioFromToken: Token
  exchangeRatioToToken: Token
  exchangeRatio: NormalizedUnitNumber
  sDaiToken: Token
  sDaiBalanceBefore: NormalizedUnitNumber
  sDaiBalanceAfter: NormalizedUnitNumber
  APY: Percentage
  outTokenAmount: NormalizedUnitNumber
}

export type SavingsDialogTxOverview = { showExchangeRate: boolean } & (
  | {
      status: 'loading'
    }
  | {
      status: 'no-overview'
    }
  | ({
      status: 'success'
    } & TxOverview)
)
