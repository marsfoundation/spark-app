import { TokenWithBalance } from '@/domain/common/types'
import { TransactionOverview } from '@/ui/organisms/new/transaction-overview/TransactionOverview'
import BigNumber from 'bignumber.js'

export interface CollateralOverviewPanelProps {
  collateral: TokenWithBalance
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}
export function CollateralOverviewPanel({
  collateral: { token, balance },
  currentHealthFactor,
  updatedHealthFactor,
}: CollateralOverviewPanelProps) {
  return (
    <TransactionOverview>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Deposit balance</TransactionOverview.Label>
        <TransactionOverview.TokenAmount token={token} amount={balance} />
      </TransactionOverview.Row>
      <TransactionOverview.Row>
        <TransactionOverview.Label>Health factor</TransactionOverview.Label>
        <TransactionOverview.HealthFactorChange
          currentHealthFactor={currentHealthFactor}
          updatedHealthFactor={updatedHealthFactor}
        />
      </TransactionOverview.Row>
    </TransactionOverview>
  )
}
