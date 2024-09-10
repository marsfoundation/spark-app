import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { ActionsContainer } from '@/features/actions/ActionsContainer'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { Alert } from '@/features/dialogs/common/components/alert/Alert'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Typography } from '@/ui/atoms/typography/Typography'
import { HealthFactorPanel } from '@/ui/organisms/health-factor-panel/HealthFactorPanel'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import { testIds } from '@/ui/utils/testIds'
import { Trans } from '@lingui/macro'
import { X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldsForAssetClass } from '../logic/form/form'
import { EasyBorrowFormSchema } from '../logic/form/validation'
import { ExistingPosition, PageStatus } from '../logic/types'
import { BorrowDetails } from '../logic/useEasyBorrow'
import { EasyBorrowForm } from './form/EasyBorrowForm'

export interface EasyBorrowPanelProps {
  pageStatus: PageStatus
  form: UseFormReturn<EasyBorrowFormSchema>
  assetsToBorrowFields: FormFieldsForAssetClass
  assetsToDepositFields: FormFieldsForAssetClass
  alreadyDeposited: ExistingPosition
  alreadyBorrowed: ExistingPosition
  updatedPositionSummary: UserPositionSummary
  setDesiredLoanToValue: (desiredLtv: Percentage) => void
  liquidationDetails?: LiquidationDetails
  riskAcknowledgement: RiskAcknowledgementInfo
  objectives: Objective[]
  borrowDetails: BorrowDetails
  guestMode: boolean
  openConnectModal: () => void
  openSandboxModal: () => void
  healthFactorPanelRef: React.RefObject<HTMLDivElement>
  actionsContext: InjectedActionsContext
}

export function EasyBorrowPanel(props: EasyBorrowPanelProps) {
  const { pageStatus, updatedPositionSummary, objectives, liquidationDetails, healthFactorPanelRef, actionsContext } =
    props

  return (
    <Panel.Wrapper className="flex min-w-full max-w-3xl flex-col self-center p-4 md:p-8">
      <div className="mb-6 flex h-10 flex-row items-center justify-between">
        <Typography variant="h3">
          <Trans>Borrow</Trans>
        </Typography>
        {pageStatus.state === 'confirmation' && (
          <Button onClick={pageStatus.onProceedToForm} variant="icon" className="-mr-4">
            <X size={28} />
          </Button>
        )}
      </div>

      <EasyBorrowForm
        {...props}
        borrowRate={props.borrowDetails.borrowRate}
        onSubmit={pageStatus.submitForm}
        disabled={pageStatus.state !== 'form'}
      />

      {pageStatus.state === 'confirmation' && (
        <div className="mt-6 flex flex-col gap-6">
          <HealthFactorPanel
            hf={updatedPositionSummary.healthFactor}
            liquidationDetails={liquidationDetails}
            variant="full-details"
            ref={healthFactorPanelRef}
          />
          {props.riskAcknowledgement.warning && (
            <RiskAcknowledgement
              onStatusChange={props.riskAcknowledgement.onStatusChange}
              warning={props.riskAcknowledgement.warning}
            />
          )}
          {props.borrowDetails.isUpgradingToUsds && (
            <Alert variant="info" data-testid={testIds.easyBorrow.form.usdsBorrowAlert}>
              Borrowing {props.borrowDetails.usds} creates {props.borrowDetails.dai} borrow position in Spark Lend.
              Borrowed {props.borrowDetails.dai} is upgraded to {props.borrowDetails.usds} in separate action listed
              below. You will see your {props.borrowDetails.dai} position on the dashboard.
            </Alert>
          )}
          <ActionsContainer
            objectives={objectives}
            context={actionsContext}
            onFinish={pageStatus.goToSuccessScreen}
            enabled={pageStatus.actionsEnabled}
          />
        </div>
      )}
    </Panel.Wrapper>
  )
}
