import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { Percentage } from '@/domain/types/NumericValues'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { SavingsMeta } from '../../logic/makeSavingsMeta'
import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { DSRLabel } from './components/DSRLabel'
import { Explainer } from './components/Explainer'

interface SavingsOpportunityGuestModeProps {
  APY: Percentage
  originChainId: SupportedChainId
  savingsMeta: SavingsMeta
  openConnectModal: () => void
  compact?: boolean
}

export function SavingsOpportunityGuestMode({
  APY,
  originChainId,
  savingsMeta,
  openConnectModal,
  compact,
}: SavingsOpportunityGuestModeProps) {
  return (
    <Panel.Wrapper variant="green" className={cn('p-6 md:px-8', !compact && 'col-span-2')}>
      {compact ? (
        <div className="flex h-full flex-col justify-between gap-10">
          <Explainer savingsMeta={savingsMeta} />

          <div className="flex items-end justify-between gap-5">
            <SavingsInfoTile>
              <SavingsInfoTile.Value size="large">
                {formatPercentage(APY, { minimumFractionDigits: 0 })}
              </SavingsInfoTile.Value>
              <DSRLabel originChainId={originChainId} savingsMetaItem={savingsMeta.primary} />
            </SavingsInfoTile>

            <Button variant="green" onClick={openConnectModal}>
              Connect wallet
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-10 sm:flex-row">
          <SavingsInfoTile alignItems="center" className="mx-auto">
            <SavingsInfoTile.Value size="huge">
              {formatPercentage(APY, { minimumFractionDigits: 0 })}
            </SavingsInfoTile.Value>
            <DSRLabel originChainId={originChainId} savingsMetaItem={savingsMeta.primary} />
          </SavingsInfoTile>
          <div className="flex flex-col items-stretch justify-between gap-5 sm:flex-row sm:items-center">
            <Explainer savingsMeta={savingsMeta} />
            <Button variant="green" onClick={openConnectModal}>
              Connect wallet
            </Button>
          </div>
        </div>
      )}
    </Panel.Wrapper>
  )
}
