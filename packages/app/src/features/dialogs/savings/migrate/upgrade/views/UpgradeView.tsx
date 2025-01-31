import { TokenWithBalance } from '@/domain/common/types'
import { Token } from '@/domain/types/Token'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { FormAndOverviewWrapper } from '@/features/dialogs/common/components/FormAndOverviewWrapper'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogForm } from '@/features/dialogs/common/components/form/DialogForm'
import { AssetInputSchema } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageStatus } from '@/features/dialogs/common/types'
import { assets } from '@/ui/assets'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Link } from '@/ui/atoms/link/Link'
import { links } from '@/ui/constants/links'
import { Info } from '@/ui/molecules/info/Info'
import { UseFormReturn } from 'react-hook-form'
import { TransactionOverview } from '../../common/components/TransactionOverview'
import { MigrateDialogTxOverview } from '../../common/types'

interface UpgradeViewProps {
  fromToken: Token
  toToken: Token
  objectives: Objective[]
  pageStatus: PageStatus
  actionsContext: InjectedActionsContext
  form: UseFormReturn<AssetInputSchema>
  assetsFields: FormFieldsForDialog
  selectableAssets: TokenWithBalance[]
  txOverview: MigrateDialogTxOverview
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
  txOverview,
}: UpgradeViewProps) {
  const dai = TokenSymbol('DAI')
  const sdai = TokenSymbol('sDAI')

  return (
    <div>
      {fromToken.symbol === dai && (
        <img
          src={assets.savings.daiUpgrade}
          width={686}
          height={207}
          alt="dai-to-usds-upgrade"
          className="w-full bg-cover bg-dai-upgrade bg-no-repeat"
        />
      )}
      {fromToken.symbol === sdai && (
        <img
          src={assets.savings.sdaiUpgrade}
          width={686}
          height={207}
          alt="sdai-to-susds-upgrade"
          className="w-full bg-cover bg-sdai-upgrade bg-no-repeat"
        />
      )}
      <MultiPanelDialog className="p-8">
        <DialogTitle className="flex items-center gap-2">
          Upgrade {fromToken.symbol} to {toToken.symbol}{' '}
          <Info>
            <div className="flex flex-col gap-2">
              <p>
                {toToken.symbol} is the new version of {fromToken.symbol}
                {fromToken.symbol === dai ? ', the stablecoin that powers the Sky ecosystem' : ''}.
              </p>
              <p>
                Upgrading to {toToken.symbol} unlocks additional benefits, providing you with more opportunities to earn
                rewards within the ecosystem.
              </p>
              <p>Upgrade is optional and you can continue using {fromToken.symbol} if you prefer.</p>
              <Link to={fromToken.symbol === dai ? links.docs.upgradeDai : links.docs.upgradeSdai} external>
                Learn more
              </Link>
            </div>
          </Info>
        </DialogTitle>

        <FormAndOverviewWrapper>
          <DialogForm form={form} assetsFields={assetsFields} selectorAssets={selectableAssets} />
          <TransactionOverview txOverview={txOverview} selectedToken={assetsFields.selectedAsset.token} />
        </FormAndOverviewWrapper>

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
