import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { ActionsContainer } from '@/features/actions/ActionsContainer'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { Form } from '@/ui/atoms/form/Form'
import { Button } from '@/ui/atoms/new/button/Button'
import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { Typography } from '@/ui/atoms/typography/Typography'
import { ConnectOrSandboxCTAButtonGroup } from '@/ui/molecules/connect-or-sandbox-cta-button-group/ConnectOrSandboxCTAButtonGroup'
import { HealthFactorPanel } from '@/ui/organisms/health-factor-panel/HealthFactorPanel'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import { XIcon } from 'lucide-react'
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
  const {
    pageStatus,
    updatedPositionSummary,
    objectives,
    liquidationDetails,
    healthFactorPanelRef,
    actionsContext,
    form,
    guestMode,
    openConnectModal,
    openSandboxModal,
  } = props

  const disabled = pageStatus.state !== 'form'

  return (
    <Panel className="flex min-w-full max-w-3xl flex-col self-center p-4 md:p-8">
      <div className="mb-6 flex h-10 flex-row items-center justify-between">
        <Typography variant="h3">Borrow</Typography>
        {pageStatus.state === 'confirmation' && (
          <IconButton onClick={pageStatus.onProceedToForm} variant="transparent" size="l" icon={XIcon} />
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(pageStatus.submitForm)} className="flex flex-col gap-4">
          <Panel className="bg-tertiary p-1.5" spacing="none">
            <EasyBorrowForm {...props} disabled={disabled} />

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
                <Panel>
                  <ActionsContainer
                    objectives={objectives}
                    context={actionsContext}
                    onFinish={pageStatus.goToSuccessScreen}
                    enabled={pageStatus.actionsEnabled}
                    actionsGridLayout="extended"
                  />
                </Panel>
              </div>
            )}
          </Panel>

          {guestMode ? (
            <ConnectOrSandboxCTAButtonGroup
              buttonText="Connect wallet"
              action={openConnectModal}
              openSandboxModal={openSandboxModal}
            />
          ) : (
            !disabled && (
              <Button type="submit" size="m" variant="primary" disabled={!form.formState.isValid}>
                Borrow
              </Button>
            )
          )}
        </form>
      </Form>
    </Panel>
  )
}
