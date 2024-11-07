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
      <DialogTitle className="py-2 md:p-0">Select network</DialogTitle>
      <div className="flex flex-col gap-3.5">
        {chains.map((chain) => (
          <div
            className={cn(
              'flex flex-col rounded-sm border border-border-primary',
              'hover:-translate-y-1 hover:shadow-lg',
              'cursor-pointer transition-all duration-300',
              chain.selected && 'border-brand-tertiary',
              !chain.selected && 'hover:border-brand-primary',
            )}
            onClick={() => chain.onSelect()}
            key={chain.name}
          >
            <div className="typography-label-4 flex items-center gap-2 border-b px-4 py-5">
              <img src={chain.logo} className="h-6 w-6" />
              {chain.name}
            </div>
            <div className="typography-label-6 p-4">
              <span className="text-secondary">Network available for:</span> {chain.supportedPages.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </MultiPanelDialog>
  )
}
