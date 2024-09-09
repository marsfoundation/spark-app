import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { SavingsMeta } from '../../logic/makeSavingsMeta'
import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { APYLabel } from './components/APYLabel'
import { Explainer } from './components/Explainer'

interface SavingsOpportunityGuestModeProps {
  APY: Percentage
  originChainId: SupportedChainId
  savingsMeta: SavingsMeta
  openConnectModal: () => void
}

export function SavingsOpportunityGuestMode({
  APY,
  originChainId,
  savingsMeta,
  openConnectModal,
}: SavingsOpportunityGuestModeProps) {
  return (
    <Panel.Wrapper variant="green">
      <div className="flex flex-col justify-between gap-10 px-8 py-6 sm:flex-row">
        <SavingsInfoTile alignItems="center" className="mx-auto">
          <SavingsInfoTile.Value size="huge">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
          <APYLabel originChainId={originChainId} />
        </SavingsInfoTile>
        <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[auto_1fr] md:gap-10">
          <Explainer savingsMeta={savingsMeta} />
          <Button variant="green" onClick={openConnectModal}>
            Connect wallet
          </Button>
        </div>
      </div>
    </Panel.Wrapper>
  )
}
