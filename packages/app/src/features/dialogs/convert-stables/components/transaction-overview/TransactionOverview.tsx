import { Token } from '@/domain/types/Token'
import { TransactionOverview } from '@/ui/organisms/new/transaction-overview/TransactionOverview'
import { testIds } from '@/ui/utils/testIds'
import { TxOverview } from '../../logic/createTxOverview'

interface ConvertStablesTransactionOverviewProps {
  inToken: Token
  outToken: Token
  txOverview: TxOverview
}

function ConvertStablesTransactionOverview({ txOverview }: ConvertStablesTransactionOverviewProps) {
  const placeholder = <TransactionOverview.Generic>-</TransactionOverview.Generic>

  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Route</TransactionOverview.Label>
        {txOverview.status !== 'success' ? (
          placeholder
        ) : (
          <TransactionOverview.Route
            route={txOverview.route.map((item) => ({
              type: 'token-amount',
              token: item.token,
              amount: item.value,
              usdAmount: item.usdValue,
            }))}
          />
        )}
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Outcome</TransactionOverview.Label>
        {txOverview.status !== 'success' ? (
          placeholder
        ) : (
          <TransactionOverview.TokenAmount
            token={txOverview.outcome.token}
            amount={txOverview.outcome.value}
            usdAmount={txOverview.outcome.usdValue}
            amountDataTestId={testIds.dialog.transactionOverview.outcome}
            usdAmountDataTestId={testIds.dialog.transactionOverview.outcomeUsd}
          />
        )}
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}

export {
  ConvertStablesTransactionOverview as TransactionOverview,
  type ConvertStablesTransactionOverviewProps as TransactionOverviewProps,
}
