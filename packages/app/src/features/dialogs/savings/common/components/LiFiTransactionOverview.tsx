import { formatPercentage } from '@/domain/common/format'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'

import { SavingsDialogTxOverviewLiFi } from '../../deposit/logic/createTxOverview'
import { TransactionOverviewBalanceChangeDetail } from './TransactionOverviewBalanceChangeDetail'
import { TransactionOverviewExchangeRateDetail } from './TransactionOverviewExchangeRateDetail'

export interface DepositOverviewPanelProps {
  txOverview: SavingsDialogTxOverviewLiFi
  showExchangeRate: boolean
}
export function LiFiTransactionOverview({
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
