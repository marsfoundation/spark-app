import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Link } from '@/ui/atoms/new/link/Link'
import { links } from '@/ui/constants/links'
import { UseFormReturn } from 'react-hook-form'
import { TransactionOverview } from '../../common/components/TransactionOverview'
import { MigrateDialogTxOverview } from '../../common/types'

interface DowngradeUSDSToDaiViewProps {
  fromToken: Token
  toToken: Token
  objectives: Objective[]
  pageStatus: PageStatus
  form: UseFormReturn<AssetInputSchema>
  txOverview: MigrateDialogTxOverview
  assetsFields: FormFieldsForDialog
  selectableAssets: TokenWithBalance[]
}

export function DowngradeUSDSToDaiView({
  fromToken,
  toToken,
  objectives,
  pageStatus,
  form,
  txOverview,
  assetsFields,
  selectableAssets,
}: DowngradeUSDSToDaiViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>
        Downgrade {fromToken.symbol} to {toToken.symbol}
      </DialogTitle>

      <div className="mb-2 text-secondary text-sm leading-snug">
        You can downgrade from USDS to DAI whenever you choose, and you are free to switch back from DAI to USDS in the
        future, at your own sole discretion.{' '}
        <Link to={links.docs.downgradeUsds} external>
          Learn more
        </Link>
      </div>

      <FormAndOverviewWrapper>
        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
        <TransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} />
      </FormAndOverviewWrapper>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
