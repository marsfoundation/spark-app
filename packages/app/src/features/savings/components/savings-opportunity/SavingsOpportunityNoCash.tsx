import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Panel } from '@/ui/atoms/panel/Panel'

import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { DSRLabel } from './components/DSRLabel'
import { Explainer } from './components/Explainer'

export interface SavingsOpportunityNoCashProps {
  DSR: Percentage
}

export function SavingsOpportunityNoCash({ DSR }: SavingsOpportunityNoCashProps) {
  return (
    <Panel.Wrapper variant="green">
      <div className="flex flex-col items-center justify-between gap-10 px-8 py-6 sm:flex-row">
        <SavingsInfoTile alignItems="center" className="mx-auto">
          <SavingsInfoTile.Value size="huge">
            {formatPercentage(DSR, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
          <DSRLabel />
        </SavingsInfoTile>
        <Explainer />
      </div>
    </Panel.Wrapper>
  )
}
