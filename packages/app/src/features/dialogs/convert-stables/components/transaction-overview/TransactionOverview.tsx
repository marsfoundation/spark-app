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
  if (txOverview.status !== 'success') {
    const placeholder = '-'

    return (
      <TransactionOverview>
        <TransactionOverview.Row>
          <TransactionOverview.Label>Route</TransactionOverview.Label>
          <TransactionOverview.Generic className="flex min-h-[36px] flex-col justify-center">
            {placeholder}
          </TransactionOverview.Generic>
        </TransactionOverview.Row>
        <TransactionOverview.Row>
          <TransactionOverview.Label>Outcome</TransactionOverview.Label>
          <TransactionOverview.Generic>{placeholder}</TransactionOverview.Generic>
        </TransactionOverview.Row>
      </TransactionOverview>
    )
  }

  const { route, outcome } = txOverview

  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Route</TransactionOverview.Label>
        <TransactionOverview.Route
          route={route.map((item) => ({
            type: 'token-amount',
            token: item.token,
            amount: item.value,
            usdAmount: item.usdValue,
          }))}
        />
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Outcome</TransactionOverview.Label>
        <TransactionOverview.TokenAmount
          token={outcome.token}
          amount={outcome.value}
          usdAmount={outcome.usdValue}
          amountDataTestId={testIds.dialog.transactionOverview.outcome}
          usdAmountDataTestId={testIds.dialog.transactionOverview.outcomeUsd}
        />
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}

export {
  ConvertStablesTransactionOverview as TransactionOverview,
  type ConvertStablesTransactionOverviewProps as TransactionOverviewProps,
}
