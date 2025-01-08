import { EModeCategoryId } from '@/domain/e-mode/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { Panel } from '@/ui/atoms/panel/Panel'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { HealthFactorPanelContent } from '@/ui/molecules/health-factor-panel-content/HealthFactorPanelContent'
import { BorrowTable } from '../components/borrow-table/BorrowTable'
import { CreatePositionPanel } from '../components/create-position-panel/CreatePositionPanel'
import { DepositTable } from '../components/deposit-table/DepositTable'
import { MyWalletPanel } from '../components/my-wallet-panel/MyWalletPanel'
import { Position } from '../components/position/Position'
import { Borrow, Deposit } from '../logic/assets'
import { PositionSummary } from '../logic/types'
import { WalletCompositionInfo } from '../logic/wallet-composition'

export interface PositionViewProps {
  positionSummary: PositionSummary
  deposits: Deposit[]
  borrows: Borrow[]
  eModeCategoryId: EModeCategoryId
  walletComposition: WalletCompositionInfo
  openDialog: OpenDialogFunction
  liquidationDetails: LiquidationDetails | undefined
}

export function PositionView({
  positionSummary,
  deposits,
  borrows,
  eModeCategoryId,
  walletComposition,
  openDialog,
  liquidationDetails,
}: PositionViewProps) {
  const hf = positionSummary.healthFactor

  return (
    <PageLayout>
      <div className="flex flex-col gap-6 xl:grid xl:grid-cols-[67%_calc(33%-18px)] xl:gap-[18px]">
        <div className="order-2 flex flex-col gap-6 xl:order-1">
          <div className="flex flex-col flex-wrap gap-4 md:flex-row">
            <Position className="order-3 flex-grow md:order-2" positionSummary={positionSummary} />
            {!positionSummary.hasDeposits && <CreatePositionPanel className="order-2 flex-grow md:order-3" />}
          </div>
          <DepositTable assets={deposits} openDialog={openDialog} />
          <BorrowTable assets={borrows} eModeCategoryId={eModeCategoryId} openDialog={openDialog} />
        </div>
        <div className="order-1 flex flex-col gap-6 md:grid md:grid-cols-2 xl:order-2 xl:flex xl:flex-col">
          <Panel variant="secondary">
            <HealthFactorPanelContent hf={hf} liquidationDetails={liquidationDetails} />
          </Panel>
          <MyWalletPanel {...walletComposition} />
        </div>
      </div>
    </PageLayout>
  )
}
