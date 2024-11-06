import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { ActionsContainer } from '@/features/actions/ActionsContainer'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { Typography } from '@/ui/atoms/typography/Typography'
import { HealthFactorPanel } from '@/ui/organisms/health-factor-panel/HealthFactorPanel'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import { Trans } from '@lingui/macro'
import { X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldsForAssetClass } from '../logic/form/form'
import { EasyBorrowFormSchema } from '../logic/form/validation'
import { ExistingPosition, PageStatus } from '../logic/types'
import { BorrowDetails } from '../logic/useEasyBorrow'
import { UsdsUpgradeAlert } from './UsdsUpgradeAlert'
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
    <Panel className="flex min-w-full max-w-3xl flex-col self-center p-4 md:p-8">
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

      <Panel className="bg-tertiary p-1.5" spacing="none">
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
              <UsdsUpgradeAlert borrowDetails={props.borrowDetails} variant="borrow" />
            )}
            <ActionsContainer
              objectives={objectives}
              context={actionsContext}
              onFinish={pageStatus.goToSuccessScreen}
              enabled={pageStatus.actionsEnabled}
              actionsGridLayout="extended"
            />
          </div>
        )}
      </Panel>
    </Panel>
  )
}
