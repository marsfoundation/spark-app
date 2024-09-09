import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Panel } from '@/ui/atoms/panel/Panel'
import { SavingsMeta } from '../../logic/makeSavingsMeta'
import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { APYLabel } from './components/APYLabel'
import { Explainer } from './components/Explainer'

export interface SavingsOpportunityNoCashProps {
  APY: Percentage
  originChainId: SupportedChainId
  savingsMeta: SavingsMeta
}

export function SavingsOpportunityNoCash({ APY, originChainId, savingsMeta }: SavingsOpportunityNoCashProps) {
  return (
    <Panel.Wrapper variant="green" className="w-full">
      <div className="flex flex-col items-center justify-between gap-10 px-8 py-6 sm:flex-row">
        <SavingsInfoTile alignItems="center" className="mx-auto">
          <SavingsInfoTile.Value size="huge">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
          <APYLabel originChainId={originChainId} />
        </SavingsInfoTile>
        <Explainer savingsMeta={savingsMeta} />
      </div>
    </Panel.Wrapper>
  )
}
