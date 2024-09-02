import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Description } from '../../common/components/Description'

interface DowngradeUSDSToDaiViewProps {
  fromToken: Token
  toToken: Token
  objectives: Objective[]
  pageStatus: PageStatus
}

export function DowngradeUSDSToDaiView({ fromToken, toToken, objectives, pageStatus }: DowngradeUSDSToDaiViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>
        Downgrade {fromToken.symbol} to {toToken.symbol}
      </DialogTitle>

      <Description>
        You can downgrade from USDS to DAI whenever you choose, and you're always free to switch back to USDS if it
        better suits your needs in the future.
      </Description>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
