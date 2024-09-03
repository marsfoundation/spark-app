import { formatPercentage } from '@/domain/common/format'
import { DebtCeilingProgress } from '@/features/markets/components/debt-ceiling-progress/DebtCeilingProgress'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'

import { CapConfig } from '@/domain/cap-automator/types'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { CooldownTimer } from '@/ui/molecules/cooldown-timer/CooldownTimer'
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
            <CapInfoTile
              token={supplyReplacement.token}
              supplyCap={supplyReplacement.supplyCap}
              totalSupplied={supplyReplacement.totalSupplied}
              capAutomatorInfo={supplyReplacement.capAutomatorInfo}
            />
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

          {supplyReplacement && (
            <InfoTile>
              <InfoTile.Label>
                <ApyTooltip variant="supply">Deposit APY</ApyTooltip>
              </InfoTile.Label>
              <InfoTile.Value>{formatPercentage(supplyReplacement.supplyAPY)}</InfoTile.Value>
            </InfoTile>
          )}
        </InfoTilesGrid>

        {props.status === 'only-in-isolation-mode' && (
          <DebtCeilingProgress debt={props.isolationModeInfo.debt} debtCeiling={props.isolationModeInfo.debtCeiling} />
        )}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}

interface CapInfoTileProps {
  token: Token
  capAutomatorInfo?: CapConfig
  supplyCap?: NormalizedUnitNumber
  totalSupplied: NormalizedUnitNumber
}

function CapInfoTile({ token, capAutomatorInfo, supplyCap, totalSupplied }: CapInfoTileProps) {
  return (
    <InfoTilesGrid>
      <InfoTile>
        <InfoTile.Label>Total supplied</InfoTile.Label>
        <InfoTile.Value>
          {token.format(totalSupplied, { style: 'compact' })} {token.symbol}
        </InfoTile.Value>
        <InfoTile.ComplementaryLine>{token.formatUSD(totalSupplied, { compact: true })}</InfoTile.ComplementaryLine>
      </InfoTile>

      {capAutomatorInfo && (
        <InfoTile>
          <InfoTile.Label>Supply cap</InfoTile.Label>
          <InfoTile.Value>
            {token.format(capAutomatorInfo.maxCap, { style: 'compact' })} {token.symbol}
          </InfoTile.Value>
          <InfoTile.ComplementaryLine>
            {token.formatUSD(capAutomatorInfo.maxCap, { compact: true })}
          </InfoTile.ComplementaryLine>
        </InfoTile>
      )}

      {supplyCap && (
        <InfoTile>
          <InfoTile.Label>{capAutomatorInfo ? 'Instantly available supply cap:' : 'Supply cap'}</InfoTile.Label>
          <InfoTile.Value>
            {token.format(supplyCap, { style: 'compact' })} {token.symbol}
            {capAutomatorInfo && (
              <CooldownTimer
                renewalPeriod={capAutomatorInfo.increaseCooldown}
                latestUpdateTimestamp={capAutomatorInfo.lastIncreaseTimestamp}
              />
            )}
          </InfoTile.Value>
          <InfoTile.ComplementaryLine>{token.formatUSD(supplyCap, { compact: true })}</InfoTile.ComplementaryLine>
        </InfoTile>
      )}
    </InfoTilesGrid>
  )
}
