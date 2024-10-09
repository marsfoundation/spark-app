import { EModeCategoryId } from '@/domain/e-mode/types'
import { LiquidationDetails } from '@/domain/market-info/getLiquidationDetails'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { HealthFactorPanel } from '@/ui/organisms/health-factor-panel/HealthFactorPanel'

import { BorrowTable } from '../components/borrow-table/BorrowTable'
import { CreatePositionPanel } from '../components/create-position-panel/CreatePositionPanel'
import { DepositTable } from '../components/deposit-table/DepositTable'
import { Position } from '../components/position/Position'
import { WalletComposition } from '../components/wallet-composition/WalletComposition'
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
  interactive: boolean
}

export function PositionView({
  positionSummary,
  deposits,
  borrows,
  eModeCategoryId,
  walletComposition,
  openDialog,
  liquidationDetails,
  interactive,
}: PositionViewProps) {
  return (
    <PageLayout className="max-w-6xl px-3 lg:px-0">
      <div className="flex flex-col flex-wrap gap-4 md:flex-row">
        <HealthFactorPanel
          hf={positionSummary.healthFactor}
          className="order-1 flex-grow md:max-w-md"
          variant="with-liquidation-price"
          liquidationDetails={liquidationDetails}
        />
        <Position className="order-3 flex-grow md:order-2" positionSummary={positionSummary} />
        {!positionSummary.hasDeposits && <CreatePositionPanel disabled={!interactive} className="order-2 flex-grow md:order-3" />}
      </div>
      <DepositTable assets={deposits} openDialog={openDialog} interactive={interactive}/>
      <BorrowTable assets={borrows} eModeCategoryId={eModeCategoryId} openDialog={openDialog} interactive={interactive}/>
      <WalletComposition {...walletComposition} />
    </PageLayout>
  )
}
