import { DialogTitle } from '@/ui/atoms/dialog/Dialog'
import { cn } from '@/ui/utils/style'
import { MultiPanelDialog } from '../../common/components/MultiPanelDialog'
import { Chain } from '../types'

export interface SelectNetworkDialogViewProps {
  chains: Chain[]
}

export function SelectNetworkDialogView({ chains }: SelectNetworkDialogViewProps) {
  return (
    <MultiPanelDialog>
      <DialogTitle>Select network</DialogTitle>
      <div className="flex flex-col gap-4">
        {chains.map((chain) => (
          <div
            className={cn(
              'flex flex-col rounded-xl border border-basics-border',
              'hover:-translate-y-1 hover:shadow-tooltip',
              'cursor-pointer transition-all duration-300',
              chain.selected && 'border-main-blue',
              !chain.selected && 'hover:border-main-blue/50',
            )}
            onClick={() => chain.onSelect()}
            key={chain.name}
          >
            <div className="mx-4 flex items-center gap-2 border-basics-border border-b py-5">
              <img src={chain.logo} className="h-6 w-6" />
              <span className="font-semibold text-base">{chain.name}</span>
            </div>
            <div className="p-4 text-sm">
              <span className="text-prompt-foreground">Network available for:</span> {chain.supportedPages.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </MultiPanelDialog>
  )
}
