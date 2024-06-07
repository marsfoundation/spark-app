import { formatPercentage } from '@/domain/common/format'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'

import { testIds } from '@/ui/utils/testIds'
import { SavingsDialogTxOverview } from '../../deposit/logic/createTxOverview'
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
  let dataTestIdIndex = 0

  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>

      <TransactionOverviewDetailsItem
        label="APY"
        data-testid={testIds.dialog.depositSavings.transactionDetailsRow(dataTestIdIndex++)}
      >
        {formatPercentage(APY)}
      </TransactionOverviewDetailsItem>
      {showExchangeRate && (
        <TransactionOverviewExchangeRateDetail
          fromToken={inputToken}
          toToken={outputToken}
          ratio={exchangeRatio}
          data-testid={testIds.dialog.depositSavings.transactionDetailsRow(dataTestIdIndex++)}
        />
      )}
      <TransactionOverviewBalanceChangeDetail
        token={sDaiToken}
        before={sDaiBalanceBefore}
        after={sDaiBalanceAfter}
        data-testid={testIds.dialog.depositSavings.transactionDetailsRow(dataTestIdIndex++)}
      />
    </DialogPanel>
  )
}
