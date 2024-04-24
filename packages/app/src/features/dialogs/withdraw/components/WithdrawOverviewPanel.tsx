import { formatPercentage } from '@/domain/common/format'
import { TokenWithValue } from '@/domain/common/types'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'

import { HealthFactorChange } from '../../common/components/HealthFactorChange'
import { TransactionOverviewDetailsItem } from '../../common/components/TransactionOverviewDetailsItem'
import { PositionOverview } from '../logic/types'

export interface WithdrawOverviewPanelProps {
  withdrawAsset: TokenWithValue
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}
export function WithdrawOverviewPanel({
  withdrawAsset,
  currentPositionOverview,
  updatedPositionOverview,
}: WithdrawOverviewPanelProps) {
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <TransactionOverviewDetailsItem label="Supply APY">
        {formatPercentage(currentPositionOverview.supplyAPY)}
      </TransactionOverviewDetailsItem>
      <RemainingSupply
        withdrawAsset={withdrawAsset}
        currentPositionOverview={currentPositionOverview}
        updatedPositionOverview={updatedPositionOverview}
      />
      <HealthFactorChange
        currentHealthFactor={currentPositionOverview.healthFactor}
        updatedHealthFactor={updatedPositionOverview?.healthFactor}
      />
    </DialogPanel>
  )
}

interface RemainingSupplyChangeProps {
  withdrawAsset: TokenWithValue
  currentPositionOverview: PositionOverview
  updatedPositionOverview?: PositionOverview
}

function RemainingSupply({
  withdrawAsset,
  currentPositionOverview,
  updatedPositionOverview,
}: RemainingSupplyChangeProps) {
  const { token } = withdrawAsset
  const currentSupply = currentPositionOverview.tokenSupply
  const updatedSupply = updatedPositionOverview?.tokenSupply

  return (
    <TransactionOverviewDetailsItem label="Remaining supply">
      {token.format(updatedSupply ?? currentSupply, { style: 'auto' })} {token.symbol}
    </TransactionOverviewDetailsItem>
  )
}
