import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { Form } from '@/ui/atoms/form/Form'
import { Button } from '@/ui/atoms/new/button/Button'
import { ConnectOrSandboxCTAButtonGroup } from '@/ui/molecules/connect-or-sandbox-cta-button-group/ConnectOrSandboxCTAButtonGroup'
import { nonZeroOrDefault } from '@/utils/bigNumber'
import { Trans } from '@lingui/macro'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldsForAssetClass } from '../../logic/form/form'
import { EasyBorrowFormSchema } from '../../logic/form/validation'
import { ExistingPosition } from '../../logic/types'
import { Borrow } from './Borrow'
import { Deposits } from './Deposits'
import { LoanToValuePanel } from './LoanToValuePanel'
import { Connector } from './Connector'

interface EasyBorrowFlowProps {
  form: UseFormReturn<EasyBorrowFormSchema>
  updatedPositionSummary: UserPositionSummary
  assetsToBorrowFields: FormFieldsForAssetClass
  assetsToDepositFields: FormFieldsForAssetClass
  alreadyDeposited: ExistingPosition
  alreadyBorrowed: ExistingPosition
  onSubmit: () => void
  setDesiredLoanToValue: (desiredLtv: Percentage) => void
  disabled: boolean // whole form is disabled when when user submitted the form and actions are in progress
  borrowRate: Percentage
  guestMode: boolean
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function EasyBorrowForm(props: EasyBorrowFlowProps) {
  const {
    form,
    onSubmit,
    assetsToBorrowFields,
    assetsToDepositFields,
    alreadyDeposited,
    alreadyBorrowed,
    updatedPositionSummary,
    setDesiredLoanToValue,
    disabled,
    guestMode,
    openConnectModal,
    openSandboxModal,
  } = props

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 relative">
          <Deposits
            selectedAssets={assetsToDepositFields.selectedAssets}
            allAssets={assetsToDepositFields.assets}
            assetToMaxValue={assetsToDepositFields.assetToMaxValue}
            addAsset={assetsToDepositFields.addAsset}
            removeAsset={assetsToDepositFields.removeAsset}
            changeAsset={assetsToDepositFields.changeAsset}
            maxSelectedFieldName={assetsToDepositFields.maxSelectedFieldName}
            alreadyDeposited={alreadyDeposited}
            control={form.control}
            disabled={disabled}
          />
          <Borrow
            selectedAssets={assetsToBorrowFields.selectedAssets}
            allAssets={assetsToBorrowFields.assets}
            changeAsset={assetsToBorrowFields.changeAsset}
            alreadyBorrowed={alreadyBorrowed}
            control={form.control}
            disabled={disabled}
          />
          <Connector className='w-[68px] absolute left-0 right-0 mx-auto top-[80px] hidden md:block' />
        </div>

        <LoanToValuePanel
          ltv={updatedPositionSummary.loanToValue}
          maxLtv={nonZeroOrDefault(updatedPositionSummary.maxLoanToValue, Percentage(0.8))}
          liquidationLtv={nonZeroOrDefault(updatedPositionSummary.currentLiquidationThreshold, Percentage(0.825))}
          onLtvChange={setDesiredLoanToValue}
          disabled={disabled}
        />

        {guestMode ? (
          <ConnectOrSandboxCTAButtonGroup
            className="mt-8"
            buttonText="Connect wallet"
            action={openConnectModal}
            openSandboxModal={openSandboxModal}
          />
        ) : (
          !disabled && (
            <Button type="submit" size="m" variant="primary" disabled={!form.formState.isValid}>
              <Trans>Borrow</Trans>
            </Button>
          )
        )}
      </form>
    </Form>
  )
}
