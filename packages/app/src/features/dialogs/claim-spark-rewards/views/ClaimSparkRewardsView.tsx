import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { TransactionOverview } from '@/ui/organisms/transaction-overview/TransactionOverview'
import { PageStatus } from '../../common/types'
import { SparkReward } from '../types'

export interface ClaimSparkRewardsViewProps {
  pageStatus: PageStatus
  objectives: Objective[]
  claims: SparkReward[]
}

export function ClaimSparkRewardsView({ claims, pageStatus, objectives }: ClaimSparkRewardsViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Claim rewards</DialogTitle>

      <TransactionOverview>
        {claims.map(({ token, amountToClaim }, index) => (
          <TransactionOverview.Row key={token.symbol}>
            <TransactionOverview.Label>Outcome {index + 1}</TransactionOverview.Label>
            <TransactionOverview.TokenAmount token={token} amount={amountToClaim} showZeroUsdAmount={false} />
          </TransactionOverview.Row>
        ))}
      </TransactionOverview>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
