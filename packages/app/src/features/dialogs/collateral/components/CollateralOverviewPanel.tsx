import BigNumber from 'bignumber.js'

import { TokenWithBalance } from '@/domain/common/types'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'

import { HealthFactorChange } from '../../common/components/HealthFactorChange'

export interface CollateralOverviewPanelProps {
  collateral: TokenWithBalance
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}
export function CollateralOverviewPanel({
  collateral: { token, balance },
  currentHealthFactor,
  updatedHealthFactor,
}: CollateralOverviewPanelProps) {
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <TransactionOverviewDetailsItem label="Deposit balance">
        <div className="flex flex-col items-end gap-0.5">
          <p className="text-base text-basics-black">
            {token.format(balance, { style: 'auto' })} {token.symbol}
          </p>
          <div className="text-basics-dark-grey text-xs">{token.formatUSD(balance)}</div>
        </div>
      </TransactionOverviewDetailsItem>
      <HealthFactorChange currentHealthFactor={currentHealthFactor} updatedHealthFactor={updatedHealthFactor} />
    </DialogPanel>
  )
}
