import { RiskAcknowledgementInfo } from '@/domain/liquidation-risk-warning/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { ActionsContainer } from '@/features/actions/ActionsContainer'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { Form } from '@/ui/atoms/form/Form'
import { Button } from '@/ui/atoms/new/button/Button'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { ConnectOrSandboxCTAButtonGroup } from '@/ui/molecules/connect-or-sandbox-cta-button-group/ConnectOrSandboxCTAButtonGroup'
import { RiskAcknowledgement } from '@/ui/organisms/risk-acknowledgement/RiskAcknowledgement'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldsForAssetClass } from '../logic/form/form'
import { EasyBorrowFormSchema } from '../logic/form/validation'
import { ExistingPosition, PageStatus } from '../logic/types'
import { BorrowDetails } from '../logic/useEasyBorrow'
import { UsdsUpgradeAlert } from './UsdsUpgradeAlert'
import { EasyBorrowForm } from './form/EasyBorrowForm'
import { EasyBorrowSidePanel } from './side-panel/EasyBorrowSidePanel'

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
  const { pageStatus, objectives, actionsContext, form, guestMode, openConnectModal, openSandboxModal } = props

  const disabled = pageStatus.state !== 'form'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(pageStatus.submitForm)} className="flex flex-1 flex-col gap-4">
        <Panel className="flex flex-col gap-3 bg-tertiary p-1.5" spacing="none">
          <EasyBorrowForm {...props} disabled={disabled} />

          <div className="xl:hidden">
            <EasyBorrowSidePanel
              {...props.borrowDetails}
              hf={props.pageStatus.state === 'confirmation' ? props.updatedPositionSummary.healthFactor : undefined}
              liquidationDetails={props.liquidationDetails}
            />
          </div>

          {pageStatus.state === 'confirmation' && (
            <div className="flex flex-col gap-3">
              {(!!props.riskAcknowledgement.warning || !!props.borrowDetails.isUpgradingToUsds) && (
                <Panel className="flex flex-col gap-6">
                  {props.riskAcknowledgement.warning && (
                    <RiskAcknowledgement
                      onStatusChange={props.riskAcknowledgement.onStatusChange}
                      warning={props.riskAcknowledgement.warning}
                    />
                  )}
                  {props.borrowDetails.isUpgradingToUsds && (
                    <UsdsUpgradeAlert borrowDetails={props.borrowDetails} variant="borrow" />
                  )}
                </Panel>
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
            <Button
              type="submit"
              size="m"
              variant="primary"
              disabled={!form.formState.isValid}
              className="disabled:before:bg-tertiary"
            >
              Borrow
            </Button>
          )
        )}
      </form>
    </Form>
  )
}
