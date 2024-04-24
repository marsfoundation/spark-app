import { Trans } from '@lingui/macro'
import { X } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { ActionsContainer } from '@/features/actions/ActionsContainer'
import { Objective } from '@/features/actions/logic/types'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Typography } from '@/ui/atoms/typography/Typography'
import { HealthFactorPanel } from '@/ui/organisms/health-factor-panel/HealthFactorPanel'

import { FormFieldsForAssetClass } from '../logic/form/form'
import { EasyBorrowFormSchema } from '../logic/form/validation'
import { ExistingPosition, PageStatus } from '../logic/types'
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

  objectives: Objective[]

  assetToBorrow: {
    symbol: TokenSymbol
    borrowRate: Percentage
  }

  guestMode: boolean
  openConnectModal: () => void

  healthFactorPanelRef: React.RefObject<HTMLDivElement>
}

export function EasyBorrowPanel(props: EasyBorrowPanelProps) {
  const { pageStatus, updatedPositionSummary, objectives: actions, liquidationDetails, healthFactorPanelRef } = props

  return (
    <Panel.Wrapper className="flex min-w-full max-w-3xl flex-col self-center p-4 md:p-8">
      <div className="mb-6 flex h-10 flex-row items-center justify-between">
        <Typography variant="h3">
          <Trans>Borrow {props.assetToBorrow.symbol}</Trans>
        </Typography>
        {pageStatus.state === 'confirmation' && (
          <Button onClick={pageStatus.onProceedToForm} variant="icon" className="-mr-4">
            <X size={28} />
          </Button>
        )}
      </div>

      <EasyBorrowForm
        {...props}
        borrowRate={props.assetToBorrow.borrowRate}
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
          <ActionsContainer objectives={actions} onFinish={pageStatus.goToSuccessScreen} />
        </div>
      )}
    </Panel.Wrapper>
  )
}
