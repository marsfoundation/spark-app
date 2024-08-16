import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Objective } from '@/features/actions/logic/types'
import { DialogActionsPanel } from '@/features/dialogs/common/components/DialogActionsPanel'
import { MultiPanelDialog } from '@/features/dialogs/common/components/MultiPanelDialog'
import { PageStatus } from '@/features/dialogs/common/types'
import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { Banner } from '../../common/components/Banner'
import { Benefits } from '../../common/components/Benefits'
import { Summary } from '../../common/components/Summary'

interface UpgradeDaiToNSTViewProps {
  fromToken: Token
  toToken: Token
  sNstAPY: Percentage
  objectives: Objective[]
  pageStatus: PageStatus
}

export function UpgradeDaiToNSTView({ fromToken, toToken, objectives, pageStatus, sNstAPY }: UpgradeDaiToNSTViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>
        Upgrade {fromToken.symbol} to {toToken.symbol}
      </DialogTitle>

      <Banner fromToken={fromToken} toToken={toToken} />

      <Summary>
        NST is the new version of DAI, the stablecoin that powers the NGT ecosystem. Upgrading to NST unlocks additional
        benefits, providing you with more opportunities to earn rewards within the ecosystem. While the upgrade is
        optional, and you can continue using DAI if you prefer, upgrading to NST offers the following advantages:
      </Summary>

      <Benefits>
        <Benefits.Item>
          <div>
            Access sNST and earn an{' '}
            <span className="font-semibold text-basics-green">${formatPercentage(sNstAPY)}</span> APY on your NST
          </div>
        </Benefits.Item>
        <Benefits.Item>Use NST to farm other tokens</Benefits.Item>
      </Benefits>

      <DialogActionsPanel
        objectives={objectives}
        onFinish={pageStatus.goToSuccessScreen}
        enabled={pageStatus.actionsEnabled}
      />
    </MultiPanelDialog>
  )
}
