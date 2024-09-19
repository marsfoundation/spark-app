import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { HealthFactorChange } from '../../common/components/transaction-overview/HealthFactorChange'
import { EModeCategory, PositionOverview } from '../types'
import { AvailableAssets } from './AvailableAssets'
import { LTVChange } from './LTVChange'

export interface EModeOverviewPanelProps {
  eModeCategory: EModeCategory
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function EModeOverviewPanel({
  eModeCategory,
  currentPositionOverview,
  updatedPositionOverview,
}: EModeOverviewPanelProps) {
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <AvailableAssets categoryName={eModeCategory.name} tokens={eModeCategory.tokens} />
      <HealthFactorChange
        currentHealthFactor={currentPositionOverview.healthFactor}
        updatedHealthFactor={updatedPositionOverview?.healthFactor}
      />
      <LTVChange currentMaxLTV={currentPositionOverview.maxLTV} updatedMaxLTV={updatedPositionOverview?.maxLTV} />
    </DialogPanel>
  )
}
