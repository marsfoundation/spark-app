import { formatPercentage } from '@/domain/common/format'
import { CollateralEligibilityStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { DebtCeilingProgress } from '@/features/markets/components/debt-ceiling-progress/DebtCeilingProgress'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'

import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { TokenBadge } from './components/token-badge/TokenBadge'

export interface CollateralStatusPanelProps {
  status: CollateralEligibilityStatus
  debtCeiling: NormalizedUnitNumber
  debt: NormalizedUnitNumber
  maxLtv: Percentage
  liquidationThreshold: Percentage
  liquidationPenalty: Percentage
  supplyReplacement?: {
    token: Token
    totalSupplied: NormalizedUnitNumber
    supplyAPY: Percentage
  }
}

export function CollateralStatusPanel({
  status,
  debtCeiling,
  debt,
  maxLtv,
  liquidationThreshold,
  liquidationPenalty,
  supplyReplacement,
}: CollateralStatusPanelProps) {
  if (status === 'no') {
    return <EmptyStatusPanel status={status} variant="collateral" />
  }

  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} />
        <Header status={status} variant="collateral" />
        <Subheader status={status} />
        {supplyReplacement && (
          <>
            <TokenBadge symbol={supplyReplacement.token.symbol} />
            <InfoTilesGrid>
              <InfoTile>
                <InfoTile.Label>Total supplied</InfoTile.Label>
                <InfoTile.Value>
                  {supplyReplacement.token.format(supplyReplacement.totalSupplied, { style: 'compact' })}{' '}
                  {supplyReplacement.token.symbol}
                </InfoTile.Value>
                <InfoTile.ComplementaryLine>
                  {supplyReplacement.token.formatUSD(supplyReplacement.totalSupplied, { compact: true })}
                </InfoTile.ComplementaryLine>
              </InfoTile>
              <InfoTile>
                <InfoTile.Label>
                  <ApyTooltip variant="supply">Deposit APY</ApyTooltip>
                </InfoTile.Label>
                <InfoTile.Value>{formatPercentage(supplyReplacement.supplyAPY)}</InfoTile.Value>
              </InfoTile>
            </InfoTilesGrid>
          </>
        )}
        <InfoTilesGrid>
          <InfoTile>
            <InfoTile.Label>Max LTV</InfoTile.Label>
            <InfoTile.Value>{formatPercentage(maxLtv)}</InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Liquidation threshold</InfoTile.Label>
            <InfoTile.Value>{formatPercentage(liquidationThreshold)}</InfoTile.Value>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Liquidation penalty</InfoTile.Label>
            <InfoTile.Value>{formatPercentage(liquidationPenalty)}</InfoTile.Value>
          </InfoTile>
        </InfoTilesGrid>

        {status === 'only-in-isolation-mode' && <DebtCeilingProgress debt={debt} debtCeiling={debtCeiling} />}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
