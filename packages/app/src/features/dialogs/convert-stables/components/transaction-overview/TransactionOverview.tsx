import { Token } from '@/domain/types/Token'
import { TransactionOverview } from '@/ui/organisms/new/transaction-overview/TransactionOverview'
import { TransactionOverviewPlaceholder } from '../../../common/components/transaction-overview/TransactionOverviewPlaceholder'
import { TxOverview } from '../../logic/createTxOverview'

interface ConvertStablesTransactionOverviewProps {
  inToken: Token
  outToken: Token
  txOverview: TxOverview
}

function ConvertStablesTransactionOverview({ inToken, outToken, txOverview }: ConvertStablesTransactionOverviewProps) {
  const badgeTokens = [inToken.symbol, outToken.symbol]

  if (txOverview.status !== 'success') {
    return <TransactionOverviewPlaceholder badgeTokens={badgeTokens} />
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
        <TransactionOverview.TokenAmount token={outcome.token} amount={outcome.value} usdAmount={outcome.usdValue} />
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}

export {
  ConvertStablesTransactionOverview as TransactionOverview,
  type ConvertStablesTransactionOverviewProps as TransactionOverviewProps,
}
