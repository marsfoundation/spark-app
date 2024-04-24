import BigNumber from 'bignumber.js'
import { UseFormReturn } from 'react-hook-form'

import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'

import { BorrowOverviewPanel } from '../components/BorrowOverviewPanel'

export interface BorrowViewProps {
  selectableAssets: TokenWithBalance[]
  borrowAsset: TokenWithValue
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}

export function BorrowView({
  selectableAssets,
  assetsFields,
  form,
  objectives,
  pageStatus,
  borrowAsset,
  currentHealthFactor,
  updatedHealthFactor,
}: BorrowViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>{`Borrow ${borrowAsset.token.symbol}`}</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <BorrowOverviewPanel currentHealthFactor={currentHealthFactor} updatedHealthFactor={updatedHealthFactor} />
      </FormAndOverviewWrapper>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
