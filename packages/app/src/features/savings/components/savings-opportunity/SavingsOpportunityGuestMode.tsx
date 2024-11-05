import { SupportedChainId } from '@/config/chain/types'
import { Percentage } from '@/domain/types/NumericValues'
import { Button } from '@/ui/atoms/new/button/Button'
import { SavingsMeta } from '../../logic/makeSavingsMeta'
import { Card } from './components/Card'
import { CardButton } from './components/CardButton'
import { Explainer } from './components/Explainer'
import { RateGrid } from './components/RateGrid'
import { SavingsRate } from './components/SavingsRate'

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
    <Card>
      <RateGrid>
        <SavingsRate originChainId={originChainId} APY={APY} savingsMetaItem={savingsMeta.primary} />
        <div className="grid grid-cols-2 gap-2">
          <CardButton onClick={openConnectModal}>Connect wallet</CardButton>
          <Button variant="secondary" size="l" onClick={openSandboxModal}>
            Try in Sandbox
          </Button>
        </div>
      </RateGrid>
      <Explainer savingsMeta={savingsMeta} />
    </Card>
  )
}
