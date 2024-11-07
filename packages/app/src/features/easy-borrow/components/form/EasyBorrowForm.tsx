import { UserPositionSummary } from '@/domain/market-info/marketInfo'
import { Percentage } from '@/domain/types/NumericValues'
import { nonZeroOrDefault } from '@/utils/bigNumber'
import { UseFormReturn } from 'react-hook-form'
import { FormFieldsForAssetClass } from '../../logic/form/form'
import { EasyBorrowFormSchema } from '../../logic/form/validation'
import { ExistingPosition } from '../../logic/types'
import { Borrow } from './Borrow'
import { Connector } from './Connector'
import { Deposits } from './Deposits'
import { LoanToValuePanel } from './LoanToValuePanel'

interface EasyBorrowFlowProps {
  form: UseFormReturn<EasyBorrowFormSchema>
  updatedPositionSummary: UserPositionSummary
  assetsToBorrowFields: FormFieldsForAssetClass
  assetsToDepositFields: FormFieldsForAssetClass
  alreadyDeposited: ExistingPosition
  alreadyBorrowed: ExistingPosition
  setDesiredLoanToValue: (desiredLtv: Percentage) => void
  disabled: boolean // whole form is disabled when when user submitted the form and actions are in progress
}

export function EasyBorrowForm(props: EasyBorrowFlowProps) {
  const {
    form,
    assetsToBorrowFields,
    assetsToDepositFields,
    alreadyDeposited,
    alreadyBorrowed,
    updatedPositionSummary,
    setDesiredLoanToValue,
    disabled,
  } = props

  return (
    <div className="flex flex-col gap-3">
      <div className="relative grid grid-cols-1 gap-1.5 md:grid-cols-2">
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
        <Connector className="absolute top-[80px] right-0 left-0 mx-auto hidden w-[68px] md:block" />
      </div>

      <LoanToValuePanel
        className="hidden md:block"
        ltv={updatedPositionSummary.loanToValue}
        maxLtv={nonZeroOrDefault(updatedPositionSummary.maxLoanToValue, Percentage(0.8))}
        liquidationLtv={nonZeroOrDefault(updatedPositionSummary.currentLiquidationThreshold, Percentage(0.825))}
        onLtvChange={setDesiredLoanToValue}
        disabled={disabled}
      />
    </div>
  )
}
