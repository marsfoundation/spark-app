import { formatPercentage } from '@/domain/common/format'
import { SupplyAvailabilityStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { CooldownTimer } from '@/ui/molecules/cooldown-timer/CooldownTimer'

import { CapAutomatorInfo, CapConfig } from '@/domain/cap-automator/types'
import { cn } from '@/ui/utils/style'
import { SparkAirdropInfoPanel } from '../spark-airdrop-info-panel/SparkAirdropInfoPanel'
import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'

interface SupplyStatusPanelProps {
  status: SupplyAvailabilityStatus
  token: Token
  totalSupplied: NormalizedUnitNumber
  apy: Percentage | undefined
  hasSparkAirdrop: boolean
  supplyCap?: NormalizedUnitNumber
  capInfo: CapAutomatorInfo['supplyCap']
}

export function SupplyStatusPanel({
  status,
  token,
  totalSupplied,
  supplyCap,
  apy,
  hasSparkAirdrop,
  capInfo,
}: SupplyStatusPanelProps) {
  if (status === 'no') {
    return <EmptyStatusPanel status={status} variant="supply" />
  }

  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} />
        <Header status={status} variant="supply" />
        <Subheader status={status} />
        <InfoTilesGrid>
          <InfoTile>
            <InfoTile.Label>Total supplied</InfoTile.Label>
            <InfoTile.Value>
              {token.format(totalSupplied, { style: 'compact' })} {token.symbol}
            </InfoTile.Value>
            <InfoTile.ComplementaryLine>{token.formatUSD(totalSupplied, { compact: true })}</InfoTile.ComplementaryLine>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>
              <ApyTooltip variant="supply">Deposit APY</ApyTooltip>
            </InfoTile.Label>
            <InfoTile.Value>{formatPercentage(apy)}</InfoTile.Value>
          </InfoTile>

          <CapInfoTile token={token} capInfo={capInfo} supplyCap={supplyCap} />
        </InfoTilesGrid>

        {hasSparkAirdrop && <SparkAirdropInfoPanel variant="deposit" eligibleToken={token.symbol} />}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}

interface CapInfoTileProps {
  token: Token
  capInfo: CapConfig | null
  supplyCap?: NormalizedUnitNumber
}

function CapInfoTile({ token, capInfo, supplyCap }: CapInfoTileProps) {
  return (
    <div className={cn('grid grid-cols-subgrid gap-[inherit]', capInfo && 'sm:col-span-2')}>
      {capInfo && (
        <InfoTile>
          <InfoTile.Label>Supply cap</InfoTile.Label>
          <InfoTile.Value>
            {token.format(capInfo.maxCap, { style: 'compact' })} {token.symbol}
          </InfoTile.Value>
          <InfoTile.ComplementaryLine>{token.formatUSD(capInfo.maxCap, { compact: true })}</InfoTile.ComplementaryLine>
        </InfoTile>
      )}

      {supplyCap && (
        <InfoTile>
          <InfoTile.Label>{capInfo ? 'Instantly available supply cap:' : 'Supply cap'}</InfoTile.Label>
          <InfoTile.Value>
            {token.format(supplyCap!, { style: 'compact' })} {token.symbol}
            {capInfo && (
              <CooldownTimer
                renewalPeriod={capInfo.increaseCooldown}
                latestUpdateTimestamp={capInfo.lastIncreaseTime}
              />
            )}
          </InfoTile.Value>
          <InfoTile.ComplementaryLine>{token.formatUSD(supplyCap!, { compact: true })}</InfoTile.ComplementaryLine>
        </InfoTile>
      )}
    </div>
  )
}
