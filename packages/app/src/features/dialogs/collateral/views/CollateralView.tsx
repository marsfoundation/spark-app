import BigNumber from 'bignumber.js'

import { TokenWithBalance } from '@/domain/common/types'
import { SetUseAsCollateralValidationIssue } from '@/domain/market-validators/validateSetUseAsCollateral'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'

import { CollateralAlert } from '../components/CollateralAlert'
import { CollateralOverviewPanel } from '../components/CollateralOverviewPanel'
import { CollateralSetting } from '../types'

interface CollateralViewProps {
  collateralSetting: CollateralSetting
  collateral: TokenWithBalance
  validationIssue: SetUseAsCollateralValidationIssue | undefined
  objectives: Objective[]
  pageStatus: PageStatus
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}

export function CollateralView({
  collateralSetting,
  collateral,
  validationIssue,
  objectives,
  pageStatus,
  currentHealthFactor,
  updatedHealthFactor,
}: CollateralViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Collateral</DialogTitle>

      <CollateralAlert collateralSetting={collateralSetting} issue={validationIssue} />

      <CollateralOverviewPanel
        collateral={collateral}
        currentHealthFactor={currentHealthFactor}
        updatedHealthFactor={updatedHealthFactor}
      />

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
