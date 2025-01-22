import { Token } from '@/domain/types/Token'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { cva } from 'class-variance-authority'
import { SavingsOverview } from '../../logic/makeSavingsOverview'
import { BottomPanel } from './BottomPanel'
import { GrowingBalance } from './GrowingBalance'
import { SidePanelGroup } from './SidePanelGroup'
import { Projections } from './types'
import { underlyingTokenToAccountType } from './utils'

export interface AccountMainPanelGroupProps {
  underlyingToken: Token
  savingsToken: Token
  savingsTokenBalance: NormalizedUnitNumber
  calculateUnderlyingTokenBalance: (timestampInMs: number) => SavingsOverview
  balanceRefreshIntervalInMs: number | undefined
  openDepositDialog: () => void
  openSendDialog: () => void
  openWithdrawDialog: () => void
  projections: Projections
}

export function AccountMainPanelGroup({
  underlyingToken,
  projections,
  savingsToken,
  savingsTokenBalance,
  openDepositDialog,
  openSendDialog,
  openWithdrawDialog,
  calculateUnderlyingTokenBalance,
  balanceRefreshIntervalInMs,
}: AccountMainPanelGroupProps) {
  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto]">
      <Panel
        variant="secondary"
        className={cn(
          mainPanelVariants({ bg: underlyingTokenToAccountType(underlyingToken) }),
          'flex flex-col justify-between gap-12',
        )}
      >
        <div className="flex justify-between">
          <div className="typography-heading-5 text-primary-inverse">{underlyingToken.symbol} Savings</div>
          <MainPanelActions
            className="hidden lg:block"
            openDepositDialog={openDepositDialog}
            openSendDialog={openSendDialog}
            openWithdrawDialog={openWithdrawDialog}
          />
        </div>
        <GrowingBalance
          underlyingToken={underlyingToken}
          calculateUnderlyingTokenBalance={calculateUnderlyingTokenBalance}
          balanceRefreshIntervalInMs={balanceRefreshIntervalInMs}
        />
        <MainPanelActions
          className="lg:hidden"
          openDepositDialog={openDepositDialog}
          openSendDialog={openSendDialog}
          openWithdrawDialog={openWithdrawDialog}
        />
      </Panel>
      <SidePanelGroup
        underlyingToken={underlyingToken}
        savingsToken={savingsToken}
        savingsTokenBalance={savingsTokenBalance}
        projections={projections}
        className="hidden lg:block"
      />
      <BottomPanel
        underlyingToken={underlyingToken}
        savingsToken={savingsToken}
        savingsTokenBalance={savingsTokenBalance}
        projections={projections}
        className="lg:hidden"
      />
    </div>
  )
}

interface MainPanelActionsProps {
  openDepositDialog: () => void
  openSendDialog: () => void
  openWithdrawDialog: () => void
  className?: string
}
function MainPanelActions({ openDepositDialog, openSendDialog, openWithdrawDialog, className }: MainPanelActionsProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 items-center gap-2.5 lg:flex">
        <Button variant="primary" onClick={openDepositDialog} className="lg:px-6">
          Deposit
        </Button>
        <Button variant="secondary" onClick={openSendDialog} className="lg:px-6">
          Send
        </Button>
        <Button variant="secondary" onClick={openWithdrawDialog} className="lg:px-6">
          Withdraw
        </Button>
      </div>
    </div>
  )
}

const mainPanelVariants = cva('bg-cover bg-right bg-no-repeat', {
  variants: {
    bg: {
      susds: 'bg-[url(/src/ui/assets/savings/accounts/usds-bg.svg)] bg-primary-inverse',
      susdc: 'bg-[url(/src/ui/assets/savings/accounts/usdc-bg.svg)] bg-primary-inverse',
      sdai: 'bg-[url(/src/ui/assets/savings/accounts/dai-bg.svg)] bg-primary-inverse',
    },
  },
  defaultVariants: {
    bg: 'susds',
  },
})
