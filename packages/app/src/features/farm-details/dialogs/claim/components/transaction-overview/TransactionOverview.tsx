import { DialogPanel } from '@/features/dialogs/common/components/DialogPanel'
import { DialogPanelTitle } from '@/features/dialogs/common/components/DialogPanelTitle'
import { getTokenImage } from '@/ui/assets'
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
        <div className="mt-6 flex justify-between">
          <div className="flex items-center gap-2.5">
            <img src={getTokenImage(token.symbol)} className="h-6 w-6" />
            <div className="flex flex-col">
              <div className="text-primary">{token.symbol}</div>
              <div className="text-prompt-foreground text-sm">{token.name} Token</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-primary">
              {token.format(value, { style: 'auto' })} {token.symbol}
            </div>
            <div className="text-prompt-foreground text-sm">~{token.formatUSD(value)}</div>
          </div>
        </div>
      </DialogPanel>
    </div>
  )
}
