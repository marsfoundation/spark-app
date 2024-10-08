import { TokenWithBalance } from '@/domain/common/types'
import { Farm } from '@/domain/farms/types'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { ExitFarmSwitch } from '../components/claim-rewards-switch/ExitFarmSwitch'
import { TransactionOverview } from '../components/transaction-overview/TransactionOverview'
import { TxOverview } from '../logic/createTxOverview'
import { ExitFarmSwitchInfo } from '../logic/useUnstakeDialog'

export interface StakeViewProps {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  farm: Farm
  objectives: Objective[]
  pageStatus: PageStatus
  txOverview: TxOverview
  exitFarmSwitchInfo: ExitFarmSwitchInfo
  actionsContext: InjectedActionsContext
}

export function UnstakeView({
  selectableAssets,
  assetsFields,
  form,
  farm,
  objectives,
  pageStatus,
  txOverview,
  exitFarmSwitchInfo,
  actionsContext,
}: StakeViewProps) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <MultiPanelDialog panelRef={ref}>
      <DialogTitle>Withdraw from {farm.blockchainInfo.name}</DialogTitle>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <TransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} />
      </FormAndOverviewWrapper>

      {exitFarmSwitchInfo.showSwitch && <ExitFarmSwitch {...exitFarmSwitchInfo} />}

      <DialogActionsPanel
        objectives={objectives}
        context={actionsContext}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
