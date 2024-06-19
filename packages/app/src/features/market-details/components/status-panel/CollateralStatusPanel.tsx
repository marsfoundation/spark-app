import { formatPercentage } from '@/domain/common/format'
import { DebtCeilingProgress } from '@/features/markets/components/debt-ceiling-progress/DebtCeilingProgress'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'

import { CollateralStatusInfo } from '../../types'
import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { TokenBadge } from './components/token-badge/TokenBadge'

export function CollateralStatusPanel(props: CollateralStatusInfo) {
  const { status, maxLtv, liquidationThreshold, liquidationPenalty, supplyReplacement } = props

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

        {props.status === 'only-in-isolation-mode' && (
          <DebtCeilingProgress debt={props.isolationModeInfo.debt} debtCeiling={props.isolationModeInfo.debtCeiling} />
        )}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
