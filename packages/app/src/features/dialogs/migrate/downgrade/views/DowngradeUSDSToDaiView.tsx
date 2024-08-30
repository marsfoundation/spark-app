import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Banner } from '../../common/components/Banner'
import { Description } from '../../common/components/Description'
import { KeyPoints } from '../../common/components/KeyPoints'

interface DowngradeUSDSToDaiViewProps {
  fromToken: Token
  toToken: Token
  apyDifference: Percentage
  objectives: Objective[]
  pageStatus: PageStatus
}

export function DowngradeUSDSToDaiView({
  fromToken,
  toToken,
  objectives,
  pageStatus,
  apyDifference,
}: DowngradeUSDSToDaiViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>
        Downgrade {fromToken.symbol} to {toToken.symbol}
      </DialogTitle>

      <Description>
        USDS is the new version of DAI, the stablecoin that powers the SKY ecosystem. USDS unlocks additional benefits,
        providing you with more opportunities to earn rewards within the ecosystem.
      </Description>

      <Banner fromToken={fromToken} toToken={toToken} />

      <Description>Downgrading to {toToken.symbol} means:</Description>

      <KeyPoints>
        <KeyPoints.Item variant="negative">
          <div>
            <span className="text-basics-red">{formatPercentage(apyDifference)} lower APY</span> compared to savings
            USDS
          </div>
        </KeyPoints.Item>
        <KeyPoints.Item variant="negative">You can't use {fromToken.symbol} to farm other tokens</KeyPoints.Item>
      </KeyPoints>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
