import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { SavingsMeta } from '../../logic/makeSavingsMeta'
import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { DSRLabel } from './components/DSRLabel'
import { Explainer } from './components/Explainer'

interface SavingsOpportunityGuestModeProps {
  APY: Percentage
  originChainId: SupportedChainId
  savingsMeta: SavingsMeta
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function SavingsOpportunityGuestMode({
  APY,
  originChainId,
  savingsMeta,
  openConnectModal,
  openSandboxModal,
}: SavingsOpportunityGuestModeProps) {
  return (
    <Panel.Wrapper variant="green" className="p-6 md:px-8">
      <div className="flex h-full flex-col justify-between gap-5">
        <Explainer savingsMeta={savingsMeta} />

        <SavingsInfoTile className="mt-auto flex flex-row items-baseline gap-2">
          <SavingsInfoTile.Value size="extraLarge" className="leading-none md:leading-none">
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
          <DSRLabel originChainId={originChainId} savingsMetaItem={savingsMeta.primary} />
        </SavingsInfoTile>

        <div className="flex flex-wrap gap-2 md:gap-4">
          <Button variant="green" onClick={openConnectModal} className="flex-1">
            Connect wallet
          </Button>
          <Button variant="secondary" onClick={openSandboxModal} className="flex-1">
            Activate sandbox
          </Button>
        </div>
      </div>
    </Panel.Wrapper>
  )
}
