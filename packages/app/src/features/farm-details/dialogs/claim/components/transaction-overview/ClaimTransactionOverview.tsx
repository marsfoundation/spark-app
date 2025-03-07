import { TransactionOverview } from '@/ui/organisms/transaction-overview/TransactionOverview'
import { testIds } from '@/ui/utils/testIds'
import { TxOverview } from '../../types'

export interface ClaimTransactionOverviewProps {
  txOverview: TxOverview
}

export function ClaimTransactionOverview({ txOverview }: ClaimTransactionOverviewProps) {
  const {
    reward: { token, value },
  } = txOverview

  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Outcome</TransactionOverview.Label>
        <TransactionOverview.TokenAmount
          token={token}
          amount={value}
          amountDataTestId={testIds.farmDetails.claimDialog.transactionOverview.rewardAmount}
          usdAmountDataTestId={testIds.farmDetails.claimDialog.transactionOverview.rewardAmountUSD}
        />
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
