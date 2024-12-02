import { EModeCategoryName } from '@/domain/e-mode/types'
import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import {
  SetUserEModeValidationIssue,
  setUserEModeValidationIssueToMessage,
} from '@/domain/market-validators/validateSetUserEMode'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'
import { Alert } from '@/ui/molecules/new/alert/Alert'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import { CategoriesGrid } from '../components/CategoriesGrid'
import { EModeCategoryTile } from '../components/EModeCategoryTile'
import { EModeOverviewPanel } from '../components/EModeOverviewPanel'
import { EModeCategory, PositionOverview } from '../types'

interface EModeViewProps {
  eModeCategories: Record<EModeCategoryName, EModeCategory>
  selectedEModeCategoryName: EModeCategoryName
  validationIssue?: SetUserEModeValidationIssue
  objectives?: Objective[]
  pageStatus: PageStatus
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
  riskAcknowledgement: RiskAcknowledgementInfo
}

export function EModeView({
  eModeCategories,
  selectedEModeCategoryName,
  validationIssue,
  objectives,
  pageStatus,
  currentPositionOverview,
  updatedPositionOverview,
  riskAcknowledgement,
}: EModeViewProps) {
  return (
    <MultiPanelDialog>
      <div className="flex flex-col gap-3">
        <DialogTitle>Set E-Mode Category</DialogTitle>
        <p className="text-secondary text-sm leading-tight">
          E-Mode allows you to borrow assets belonging to the selected category.
          <br />
          Please visit our{' '}
          <Link to={links.docs.eMode} external>
            FAQ guide
          </Link>{' '}
          to learn more about how it works and the applied restrictions.
        </p>
      </div>

      <CategoriesGrid>
        {Object.values(eModeCategories).map((eModeCategory) => (
          <EModeCategoryTile key={eModeCategory.name} eModeCategory={eModeCategory} />
        ))}
      </CategoriesGrid>

      <EModeOverviewPanel
        eModeCategory={eModeCategories[selectedEModeCategoryName]}
        currentPositionOverview={currentPositionOverview}
        updatedPositionOverview={updatedPositionOverview}
      />

      {validationIssue && <Alert variant="error">{setUserEModeValidationIssueToMessage[validationIssue]}</Alert>}

      {riskAcknowledgement.warning && (
        <RiskAcknowledgement
          onStatusChange={riskAcknowledgement.onStatusChange}
          warning={riskAcknowledgement.warning}
        />
      )}

      {objectives && (
        <DialogActionsPanel
          objectives={objectives}
          onFinish={pageStatus.goToSuccessScreen}
          enabled={pageStatus.actionsEnabled}
        />
      )}
    </MultiPanelDialog>
  )
}
