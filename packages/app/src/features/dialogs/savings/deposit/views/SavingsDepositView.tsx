import { TokenWithBalance } from '@/domain/common/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { usePortalRef } from '@/ui/utils/usePortalRef'
import { UseFormReturn } from 'react-hook-form'
import { TransactionOverview } from '../../common/components/transaction-overview'
import { SavingsDialogTxOverview } from '../../common/types'
import { UpgradeToSusdsSwitch } from '../components/UpgradeToSusdsSwitch'
import { SavingsUsdsSwitchInfo } from '../logic/useSavingsDepositDialog'

export interface SavingsDepositViewProps {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview
  savingsUsdsSwitchInfo: SavingsUsdsSwitchInfo
  actionsContext: InjectedActionsContext
}

export function SavingsDepositView({
  selectableAssets,
  assetsFields,
  form,
  objectives,
  pageStatus,
  txOverview,
  savingsUsdsSwitchInfo,
  actionsContext,
}: SavingsDepositViewProps) {
  const { portalRef: benefitsDialogPortalContainerRef, refCallback: benefitsDialogPortalContainerRefCallback } =
    usePortalRef()

  return (
    <MultiPanelDialog panelRef={benefitsDialogPortalContainerRefCallback}>
      <DialogTitle>Deposit to Savings</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <TransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} showAPY />
      </FormAndOverviewWrapper>

      {savingsUsdsSwitchInfo.showSwitch && (
        <UpgradeToSusdsSwitch
          {...savingsUsdsSwitchInfo}
          benefitsDialogPortalContainerRef={benefitsDialogPortalContainerRef}
        />
      )}

      <DialogActionsPanel
        objectives={objectives}
        context={actionsContext}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
