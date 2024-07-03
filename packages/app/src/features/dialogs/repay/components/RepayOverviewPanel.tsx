import { Token } from '@/domain/types/Token'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'

import { HealthFactorChange } from '../../common/components/HealthFactorChange'
import { TokenValueChange } from '../../common/components/TokenValueChange'
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
      <TokenValueChange
        token={debtAsset}
        currentValue={currentPositionOverview.debt}
        updatedValue={updatedPositionOverview?.debt}
        label="Debt"
      />
      <HealthFactorChange
        currentHealthFactor={currentPositionOverview.healthFactor}
        updatedHealthFactor={updatedPositionOverview?.healthFactor}
      />
    </DialogPanel>
  )
}
