import { Token } from '@/domain/types/Token'
import { InjectedActionsContext, Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { KeyPoints } from '@/ui/atoms/key-points/KeyPoints'
import { Link } from '@/ui/atoms/link/Link'
import { Banner } from '../../common/components/Banner'
import { Description } from '../../common/components/Description'

interface UpgradeDaiToUSDSViewProps {
  fromToken: Token
  toToken: Token
  objectives: Objective[]
  pageStatus: PageStatus
  actionsContext: InjectedActionsContext
}

export function UpgradeDaiToUSDSView({
  fromToken,
  toToken,
  objectives,
  pageStatus,
  actionsContext,
}: UpgradeDaiToUSDSViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>
        Upgrade {fromToken.symbol} to {toToken.symbol}
      </DialogTitle>

      <Description>
        USDS is the new version of DAI, the stablecoin that powers the Sky ecosystem. Upgrading to USDS unlocks
        additional benefits, providing you with more opportunities to earn rewards within the ecosystem. While the
        upgrade is optional, and you can continue using DAI if you prefer.{' '}
        <Link to="google.com" external>
          Learn more
        </Link>
      </Description>

      <Banner fromToken={fromToken} toToken={toToken} />

      <KeyPoints>
        <KeyPoints.Item variant="positive">Use {toToken.symbol} to farm other tokens.</KeyPoints.Item>
        <KeyPoints.Item variant="positive">Downgrade to {fromToken.symbol} anytime, without any fees.</KeyPoints.Item>
      </KeyPoints>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
        context={actionsContext}
      />
    </MultiPanelDialog>
  )
}
