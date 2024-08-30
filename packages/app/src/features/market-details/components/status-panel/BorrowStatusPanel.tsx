import { formatPercentage } from '@/domain/common/format'
import { BorrowEligibilityStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { CooldownTimer } from '@/ui/molecules/cooldown-timer/CooldownTimer'

import { CapAutomatorInfo } from '@/domain/cap-automator/types'
import { InterestYieldChart, InterestYieldChartProps } from '../charts/interest-yield/InterestYieldChart'
import { SparkAirdropInfoPanel } from '../spark-airdrop-info-panel/SparkAirdropInfoPanel'
import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { TokenBadge } from './components/token-badge/TokenBadge'

interface BorrowStatusPanelProps {
  status: BorrowEligibilityStatus
  token: Token
  totalBorrowed: NormalizedUnitNumber
  borrowCap?: NormalizedUnitNumber
  reserveFactor: Percentage
  apy: Percentage | undefined
  chartProps: InterestYieldChartProps
  showTokenBadge?: boolean
  hasSparkAirdrop: boolean
  capInfo: CapAutomatorInfo['borrowCap']
}

export function BorrowStatusPanel({
  status,
  token,
  totalBorrowed,
  borrowCap,
  reserveFactor,
  apy,
  chartProps,
  showTokenBadge = false,
  hasSparkAirdrop,
  capInfo,
}: BorrowStatusPanelProps) {
  if (status === 'no') {
    return <EmptyStatusPanel status={status} variant="borrow" />
  }

  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} />
        <Header status={status} variant="borrow" />
        <Subheader status={status} />
        {showTokenBadge && <TokenBadge symbol={token.symbol} />}
        <InfoTilesGrid>
          <InfoTile>
            <InfoTile.Label>Total borrowed</InfoTile.Label>
            <InfoTile.Value>
              {token.format(totalBorrowed, { style: 'compact' })} {token.symbol}
            </InfoTile.Value>
            <InfoTile.ComplementaryLine>{token.formatUSD(totalBorrowed, { compact: true })}</InfoTile.ComplementaryLine>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>
              <ApyTooltip variant="borrow">Borrow APY</ApyTooltip>
            </InfoTile.Label>
            <InfoTile.Value>{formatPercentage(apy)}</InfoTile.Value>
          </InfoTile>
          {borrowCap && capInfo === null && (
            <InfoTile>
              <InfoTile.Label>Borrow cap</InfoTile.Label>
              <InfoTile.Value>
                {token.format(borrowCap, { style: 'compact' })} {token.symbol}
              </InfoTile.Value>
              <InfoTile.ComplementaryLine>{token.formatUSD(borrowCap, { compact: true })}</InfoTile.ComplementaryLine>
            </InfoTile>
          )}
          <InfoTile>
            <InfoTile.Label>Reserve factor</InfoTile.Label>
            <InfoTile.Value>{formatPercentage(reserveFactor)}</InfoTile.Value>
          </InfoTile>
        </InfoTilesGrid>

        {capInfo && (
          <InfoTilesGrid>
            <InfoTile>
              <InfoTile.Label>Borrow cap</InfoTile.Label>
              <InfoTile.Value>
                {token.format(capInfo.maxCap, { style: 'compact' })} {token.symbol}
              </InfoTile.Value>
              <InfoTile.ComplementaryLine>
                {token.formatUSD(capInfo.maxCap, { compact: true })}
              </InfoTile.ComplementaryLine>
            </InfoTile>

            <InfoTile>
              <InfoTile.Label>Instantly available borrow cap:</InfoTile.Label>
              <InfoTile.Value>
                {token.format(borrowCap!, { style: 'compact' })} {token.symbol}
                <CooldownTimer
                  renewalPeriod={capInfo.increaseCooldown}
                  latestUpdateTimestamp={capInfo.lastIncreaseTime}
                />
              </InfoTile.Value>
              <InfoTile.ComplementaryLine>{token.formatUSD(borrowCap!, { compact: true })}</InfoTile.ComplementaryLine>
            </InfoTile>
          </InfoTilesGrid>
        )}
        <div className="col-span-3 mt-6 sm:mt-10">
          <InterestYieldChart {...chartProps} />
        </div>
        {hasSparkAirdrop && <SparkAirdropInfoPanel variant="borrow" eligibleToken={token.symbol} />}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
