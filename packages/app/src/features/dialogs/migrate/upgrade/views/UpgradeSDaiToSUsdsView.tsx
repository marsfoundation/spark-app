import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { assets } from '@/ui/assets'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { KeyPoints } from '@/ui/atoms/key-points/KeyPoints'
import { Link } from '@/ui/atoms/link/Link'
import { Description } from '../../common/components/Description'

interface UpgradeSDaiToSUsdsViewProps {
  fromToken: Token
  toToken: Token
  apyImprovement?: Percentage
  objectives: Objective[]
  pageStatus: PageStatus
  actionsContext: InjectedActionsContext
}

export function UpgradeSDaiToSUsdsView({
  fromToken,
  toToken,
  objectives,
  pageStatus,
  apyImprovement,
  actionsContext,
}: UpgradeSDaiToSUsdsViewProps) {
  return (
    <>
      <img src={assets.banners.sdaiToSusdsUpgrade} alt="sdai-to-susds-upgrade-banner" className="w-full max-w-xl" />
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

        <KeyPoints>
          {apyImprovement && (
            <KeyPoints.Item variant="positive">
              <div>
                <span className="text-basics-green">{formatPercentage(apyImprovement)} higher APY</span> compared to
                Savings DAI
              </div>
            </KeyPoints.Item>
          )}
          <KeyPoints.Item variant="positive">Downgrade to {fromToken.symbol} anytime, without any fees.</KeyPoints.Item>
        </KeyPoints>

        <DialogActionsPanel
          objectives={objectives}
          onFinish={pageStatus.goToSuccessScreen}
          enabled={pageStatus.actionsEnabled}
          context={actionsContext}
        />
      </MultiPanelDialog>
    </>
  )
}
