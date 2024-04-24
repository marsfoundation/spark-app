import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'

import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { DSRLabel } from './components/DSRLabel'
import { Explainer } from './components/Explainer'

interface SavingsOpportunityGuestModeProps {
  DSR: Percentage
  openConnectModal: () => void
}

export function SavingsOpportunityGuestMode({ openConnectModal, DSR }: SavingsOpportunityGuestModeProps) {
  return (
    <Panel.Wrapper variant="green">
      <div className="flex flex-col justify-between gap-10 px-8 py-6 sm:flex-row">
        <SavingsInfoTile alignItems="center" className="mx-auto">
          <SavingsInfoTile.Value size="huge">
            {formatPercentage(DSR, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
          <DSRLabel />
        </SavingsInfoTile>
        <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[auto_1fr] md:gap-10">
          <Explainer />
          <Button variant="green" onClick={openConnectModal}>
            Connect wallet
          </Button>
        </div>
      </div>
    </Panel.Wrapper>
  )
}
