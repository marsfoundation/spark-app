import BigNumber from 'bignumber.js'

import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'

import { HealthFactorChange } from '../../common/components/HealthFactorChange'

export interface BorrowOverviewPanelProps {
  currentHealthFactor?: BigNumber
  updatedHealthFactor?: BigNumber
}
export function BorrowOverviewPanel({ currentHealthFactor, updatedHealthFactor }: BorrowOverviewPanelProps) {
  if (currentHealthFactor === undefined && updatedHealthFactor === undefined) {
    return null
  }

  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <HealthFactorChange currentHealthFactor={currentHealthFactor} updatedHealthFactor={updatedHealthFactor} />
    </DialogPanel>
  )
}
