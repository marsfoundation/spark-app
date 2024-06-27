import { TokenWithBalance } from '@/domain/common/types'
import { SetUseAsCollateralValidationIssue } from '@/domain/market-validators/validateSetUseAsCollateral'
import { RiskAcknowledgementInfo } from '@/domain/risk-warning/types'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import BigNumber from 'bignumber.js'
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
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function CollateralView({
  collateralSetting,
  collateral,
  validationIssue,
  objectives,
  pageStatus,
  currentHealthFactor,
  updatedHealthFactor,
  riskAcknowledgement,
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

      {riskAcknowledgement.warning && (
        <RiskAcknowledgement
          onStatusChange={riskAcknowledgement.onStatusChange}
          warning={riskAcknowledgement.warning}
        />
      )}

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
