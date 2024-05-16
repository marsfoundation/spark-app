import { formatPercentage } from '@/domain/common/format'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'

import { SavingsDialogTxOverview } from '../../deposit/logic/useTransactionOverview'
import { TransactionOverviewBalanceChangeDetail } from './TransactionOverviewBalanceChangeDetail'
import { TransactionOverviewExchangeRateDetail } from './TransactionOverviewExchangeRateDetail'

export interface DepositOverviewPanelProps {
  txOverview: SavingsDialogTxOverview
  showExchangeRate: boolean
}
export function DepositOverviewPanel({
  txOverview: {
    APY,
    sDaiBalanceAfter,
    sDaiBalanceBefore,
    exchangeRatio,
    exchangeRatioFromToken: inputToken,
    sDaiToken,
    exchangeRatioToToken: outputToken,
  },
  showExchangeRate,
}: DepositOverviewPanelProps) {
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>

      <TransactionOverviewDetailsItem label="APY">{formatPercentage(APY)}</TransactionOverviewDetailsItem>
      {showExchangeRate && (
        <TransactionOverviewExchangeRateDetail fromToken={inputToken} toToken={outputToken} ratio={exchangeRatio} />
      )}
      <TransactionOverviewBalanceChangeDetail token={sDaiToken} before={sDaiBalanceBefore} after={sDaiBalanceAfter} />
    </DialogPanel>
  )
}
