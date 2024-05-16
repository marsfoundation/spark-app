import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { SavingsDepositDialog } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'

import { Projections } from '../../types'
import { SavingsInfoTile, ValueProps } from '../savings-info-tile/SavingsInfoTile'
import { APYLabel } from './components/APYLabel'
import { Explainer } from './components/Explainer'

export interface SavingsDAIProps {
  APY: Percentage
  chainId: SupportedChainId
  projections: Projections
  maxBalanceToken: TokenWithBalance
  openDialog: OpenDialogFunction
  totalEligibleCashUSD: NormalizedUnitNumber
}

export function SavingsOpportunity({
  APY,
  chainId,
  projections,
  maxBalanceToken,
  openDialog,
  totalEligibleCashUSD,
}: SavingsDAIProps) {
  const compactProjections = projections.thirtyDays.gt(1_000)
  const savingsTileSizeVariant = getValueSizeVariant(projections.oneYear, compactProjections)
  function openDepositDialog(): void {
    openDialog(SavingsDepositDialog, { initialToken: maxBalanceToken.token })
  }

  return (
    <Panel.Wrapper
      className="flex min-h-[260px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-8"
      variant="green"
    >
      <div className="flex w-full flex-row items-start justify-between">
        <Explainer stablecoinValue={totalEligibleCashUSD} />
        <div className="ml-10 hidden min-w-fit md:block">
          <Button variant="green" onClick={openDepositDialog}>
            Start saving!
          </Button>
        </div>
      </div>
      <div className="flex flex-row items-end justify-between">
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is how much you'll earn in 30 days">
            <div className="hidden md:block"> 30-day projection </div>
            <div className="md:hidden"> 30-day </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value size={savingsTileSizeVariant}>
            +{formatProjectionValue(projections.thirtyDays, compactProjections)}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <SavingsInfoTile>
          <SavingsInfoTile.Label tooltipContent="This is how much you'll earn in 1 year">
            <div className="hidden md:block"> 1-year projection </div>
            <div className="md:hidden"> 1-year </div>
          </SavingsInfoTile.Label>
          <SavingsInfoTile.Value size={savingsTileSizeVariant}>
            +{formatProjectionValue(projections.oneYear, compactProjections)}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
        <SavingsInfoTile>
          <APYLabel chainId={chainId} />
          <SavingsInfoTile.Value size={savingsTileSizeVariant}>
            {formatPercentage(APY, { minimumFractionDigits: 0 })}
          </SavingsInfoTile.Value>
        </SavingsInfoTile>
      </div>
      <div className="w-full md:hidden">
        <Button variant="green" className="w-full" onClick={openDepositDialog}>
          Start saving!
        </Button>
      </div>
    </Panel.Wrapper>
  )
}

function formatProjectionValue(value: NormalizedUnitNumber, compact: boolean): string {
  return USD_MOCK_TOKEN.formatUSD(value, {
    showCents: 'when-not-round',
    compact,
  })
}

function getValueSizeVariant(value: NormalizedUnitNumber, compact: boolean): ValueProps['size'] {
  const formattedValue = formatProjectionValue(value, compact)
  if (formattedValue.length > 8) {
    return 'medium'
  }
  return 'large'
}
