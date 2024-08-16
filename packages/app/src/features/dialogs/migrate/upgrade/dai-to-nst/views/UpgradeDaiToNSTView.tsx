import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Banner } from '../../../common/components/Banner'
import { Description } from '../../../common/components/Description'
import { KeyPoints } from '../../../common/components/KeyPoints'

interface UpgradeDaiToNSTViewProps {
  fromToken: Token
  toToken: Token
  apyDifference: Percentage
  objectives: Objective[]
  pageStatus: PageStatus
}

export function UpgradeDaiToNSTView({
  fromToken,
  toToken,
  objectives,
  pageStatus,
  apyDifference,
}: UpgradeDaiToNSTViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>
        Upgrade {fromToken.symbol} to {toToken.symbol}
      </DialogTitle>

      <Description>
        NST is the new version of DAI, the stablecoin that powers the NGT ecosystem. NST unlocks additional benefits,
        providing you with more opportunities to earn rewards within the ecosystem.
      </Description>

      <Banner fromToken={fromToken} toToken={toToken} />

      <Description>Upgrading to {toToken.symbol} offers the following advantages:</Description>

      <KeyPoints>
        <KeyPoints.Item variant="positive">
          <div>
            <span className="text-basics-green">{formatPercentage(apyDifference)} higher APY</span> compared to Savings
            DAI
          </div>
        </KeyPoints.Item>
        <KeyPoints.Item variant="positive">Use {toToken.symbol} to farm other tokens</KeyPoints.Item>
      </KeyPoints>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
