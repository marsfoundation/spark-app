import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { assets } from '@/ui/assets'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Link } from '@/ui/atoms/link/Link'
import { UseFormReturn } from 'react-hook-form'
import { Description } from '../../common/components/Description'

interface UpgradeViewProps {
  fromToken: Token
  toToken: Token
  objectives: Objective[]
  pageStatus: PageStatus
  actionsContext: InjectedActionsContext
  form: UseFormReturn<AssetInputSchema>
  assetsFields: FormFieldsForDialog
  selectableAssets: TokenWithBalance[]
}

export function UpgradeView({
  fromToken,
  toToken,
  objectives,
  pageStatus,
  actionsContext,
  form,
  assetsFields,
  selectableAssets,
}: UpgradeViewProps) {
  return (
    <div>
      <img src={assets.banners.daiToUsdsUpgrade} alt="dai-to-usds-upgrade-banner" className="w-full sm:max-w-xl" />
      <MultiPanelDialog className="p-6">
        <DialogTitle>
          Upgrade {fromToken.symbol} to {toToken.symbol}
        </DialogTitle>

        <Description>
          USDS is the new version of DAI, the stablecoin that powers the Sky ecosystem. Upgrading to USDS unlocks
          additional benefits, providing you with more opportunities to earn rewards within the ecosystem. Upgrade is
          optional and you can continue using DAI if you prefer. {/* {@todo: add proper link to docs when ready} */}
          <Link to="/" external>
            Learn more
          </Link>
        </Description>

        <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />

        <DialogActionsPanel
          objectives={objectives}
          onFinish={pageStatus.goToSuccessScreen}
          enabled={pageStatus.actionsEnabled}
          context={actionsContext}
        />
      </MultiPanelDialog>
    </div>
  )
}
