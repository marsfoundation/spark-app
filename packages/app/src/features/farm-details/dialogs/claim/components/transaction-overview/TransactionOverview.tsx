import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { getTokenImage } from '@/ui/assets'
import { testIds } from '@/ui/utils/testIds'
import { TxOverview } from '../../types'

export interface TransactionOverviewProps {
  txOverview: TxOverview
}

export function TransactionOverview({ txOverview }: TransactionOverviewProps) {
  const {
    reward: { token, value },
  } = txOverview

  return (
    <div className="isolate">
      <DialogPanel className="shadow-none">
        <DialogPanelTitle>Transaction overview</DialogPanelTitle>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={getTokenImage(token.symbol)} className="h-6 w-6" />
            <div className="flex flex-col">
              <div
                className="text-primary"
                data-testid={testIds.farmDetails.claimDialog.transactionOverview.rewardTokenSymbol}
              >
                {token.symbol}
              </div>
              <div
                className="text-prompt-foreground text-sm"
                data-testid={testIds.farmDetails.claimDialog.transactionOverview.rewardTokenDescription}
              >
                {token.name}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div
              className="text-primary"
              data-testid={testIds.farmDetails.claimDialog.transactionOverview.rewardAmount}
            >
              {token.format(value, { style: 'auto' })} {token.symbol}
            </div>
            {token.unitPriceUsd.gt(0) && (
              <div
                className="text-prompt-foreground text-sm"
                data-testid={testIds.farmDetails.claimDialog.transactionOverview.rewardAmountUSD}
              >
                ~{token.formatUSD(value)}
              </div>
            )}
          </div>
        </div>
      </DialogPanel>
    </div>
  )
}
