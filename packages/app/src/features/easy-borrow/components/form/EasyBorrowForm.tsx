import { Trans } from '@lingui/macro'
import { UseFormReturn } from 'react-hook-form'

import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { Button } from '@/ui/atoms/button/Button'
import { Form } from '@/ui/atoms/form/Form'
import { nonZeroOrDefault } from '@/utils/bigNumber'

import { FormFieldsForAssetClass } from '../../logic/form/form'
import { EasyBorrowFormSchema } from '../../logic/form/validation'
import { ExistingPosition } from '../../logic/types'
import { EasyBorrowNote } from '../note/EasyBorrowNote'
import { Borrow } from './Borrow'
import { Deposits } from './Deposits'
import { LoanToValue } from './LoanToValue'
import { LoanToValueSlider } from './LoanToValueSlider'

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
    borrowRate,
    guestMode,
    openConnectModal,
  } = props

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col gap-2 md:flex-row">
          <Deposits
            selectedAssets={assetsToDepositFields.selectedAssets}
            allAssets={assetsToDepositFields.allAssets}
            assetToMaxValue={assetsToDepositFields.assetToMaxValue}
            addAsset={assetsToDepositFields.addAsset}
            removeAsset={assetsToDepositFields.removeAsset}
            changeAsset={assetsToDepositFields.changeAsset}
            alreadyDeposited={alreadyDeposited}
            control={form.control}
            disabled={disabled}
          />
          <div>
            <img src={assets.link} className="m-2 mt-16 hidden md:block" />
          </div>
          <Borrow
            selectedAssets={assetsToBorrowFields.selectedAssets}
            alreadyBorrowed={alreadyBorrowed}
            control={form.control}
            disabled={disabled}
          />
        </div>

        <LoanToValue
          className="mt-6"
          loanToValue={updatedPositionSummary.loanToValue}
          maxLoanToValue={updatedPositionSummary.maxLoanToValue}
        />

        <LoanToValueSlider
          className="mt-10"
          ltv={updatedPositionSummary.loanToValue}
          maxAvailableLtv={nonZeroOrDefault(updatedPositionSummary.maxLoanToValue, Percentage(0.8))}
          liquidationLtv={nonZeroOrDefault(updatedPositionSummary.currentLiquidationThreshold, Percentage(0.825))}
          onLtvChange={setDesiredLoanToValue}
          disabled={disabled}
        />

        <EasyBorrowNote borrowRate={borrowRate} />

        {guestMode ? (
          <Button className="mt-8" onClick={openConnectModal}>
            <Trans>Connect your wallet</Trans>
          </Button>
        ) : (
          !disabled && (
            <Button type="submit" className="mt-8" disabled={!form.formState.isValid}>
              <Trans>Borrow</Trans>
            </Button>
          )
        )}
      </form>
    </Form>
  )
}
