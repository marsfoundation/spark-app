import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Panel } from '@/ui/atoms/panel/Panel'

import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { APYLabel } from './components/APYLabel'
import { Explainer } from './components/Explainer'

export interface SavingsOpportunityNoCashProps {
  APY: Percentage
  chainId: SupportedChainId
}

export function SavingsOpportunityNoCash({ APY, chainId }: SavingsOpportunityNoCashProps) {
  return (
    <Panel.Wrapper variant="green">
      <div className="flex flex-col items-center justify-between gap-10 px-8 py-6 sm:flex-row">
        <SavingsInfoTile alignItems="center" className="mx-auto">
          <SavingsInfoTile.Value size="huge">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
          <APYLabel chainId={chainId} />
        </SavingsInfoTile>
        <Explainer />
      </div>
    </Panel.Wrapper>
  )
}
