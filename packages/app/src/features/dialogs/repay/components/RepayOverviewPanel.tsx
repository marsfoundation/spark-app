import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'

import { HealthFactorChange } from '../../common/components/HealthFactorChange'
import { TransactionOverviewDetailsItem } from '../../common/components/TransactionOverviewDetailsItem'
import { PositionOverview } from '../logic/types'

export interface RepayOverviewPanelProps {
  debtAsset: Token
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function RepayOverviewPanel({
  debtAsset,
  currentPositionOverview,
  updatedPositionOverview,
}: RepayOverviewPanelProps) {
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <RemainingDebt
        debtAsset={debtAsset}
        currentPositionOverview={currentPositionOverview}
        updatedPositionOverview={updatedPositionOverview}
      />
      <HealthFactorChange
        currentHealthFactor={currentPositionOverview.healthFactor}
        updatedHealthFactor={updatedPositionOverview?.healthFactor}
      />
    </DialogPanel>
  )
}

interface RemainingDebtChangeProps {
  debtAsset: Token
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}

function RemainingDebt({ debtAsset, currentPositionOverview, updatedPositionOverview }: RemainingDebtChangeProps) {
  const currentDebt = currentPositionOverview.debt
  const updatedDebt = updatedPositionOverview?.debt

  return (
    <TransactionOverviewDetailsItem label="Remaining debt">
      {debtAsset.format(updatedDebt ?? currentDebt, { style: 'auto' })} {debtAsset.symbol}
    </TransactionOverviewDetailsItem>
  )
}
