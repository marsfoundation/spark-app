import { formatPercentage } from '@/domain/common/format'
import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { TransactionOverviewDetailsItem } from '@/features/dialogs/common/components/TransactionOverviewDetailsItem'

import { assets } from '@/ui/assets'
import { SavingsDialogTxOverview } from '../types'
import { TransactionOverviewBalanceChangeDetail } from './TransactionOverviewBalanceChangeDetail'
import { TransactionOverviewExchangeRateDetail } from './TransactionOverviewExchangeRateDetail'

export interface SavingsOverviewPanelProps {
  txOverview: SavingsDialogTxOverview
}
export function SavingsOverviewPanel({ txOverview }: SavingsOverviewPanelProps) {
  if (txOverview.status !== 'success') {
    return (
      <SavingsOverviewPanelPlaceholder
        isLoading={txOverview.status === 'loading'}
        showExchangeRate={txOverview.showExchangeRate}
      />
    )
  }

  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>

      <TransactionOverviewDetailsItem label="APY">{formatPercentage(txOverview.APY)}</TransactionOverviewDetailsItem>
      {txOverview.showExchangeRate && (
        <TransactionOverviewExchangeRateDetail
          fromToken={txOverview.exchangeRatioFromToken}
          toToken={txOverview.exchangeRatioToToken}
          ratio={txOverview.exchangeRatio}
        />
      )}
      <TransactionOverviewBalanceChangeDetail
        token={txOverview.sDaiToken}
        before={txOverview.sDaiBalanceBefore}
        after={txOverview.sDaiBalanceAfter}
      />
    </DialogPanel>
  )
}

interface SavingsOverviewPanelPlaceholder {
  isLoading: boolean
  showExchangeRate: boolean
}
function SavingsOverviewPanelPlaceholder({ isLoading, showExchangeRate }: SavingsOverviewPanelPlaceholder) {
  const placeholder = isLoading ? (
    <img src={assets.threeDots} alt="loader" width={20} height={5} data-chromatic="ignore" />
  ) : (
    '-'
  )
  return (
    <DialogPanel>
      <DialogPanelTitle>Transaction overview</DialogPanelTitle>
      <TransactionOverviewDetailsItem label="APY">{placeholder}</TransactionOverviewDetailsItem>
      {showExchangeRate && (
        <TransactionOverviewDetailsItem label="Exchange Rate">{placeholder}</TransactionOverviewDetailsItem>
      )}
      <TransactionOverviewDetailsItem label="sDAI balance">{placeholder}</TransactionOverviewDetailsItem>
    </DialogPanel>
  )
}
