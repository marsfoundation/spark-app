import { formatPercentage } from '@/domain/common/format'
import { BorrowEligibilityStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { CooldownTimer } from '@/ui/molecules/cooldown-timer/CooldownTimer'

import { CapAutomatorConfig } from '@/domain/cap-automator/types'
import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { InterestYieldChart, InterestYieldChartProps } from '../charts/interest-yield/InterestYieldChart'
import { SparkAirdropInfoPanel } from '../spark-airdrop-info-panel/SparkAirdropInfoPanel'
import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { InfoTilesGrid } from './components/InfoTilesGrid'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { StatusIcon } from './components/status-icon/StatusIcon'

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
  capAutomatorInfo?: CapAutomatorConfig
}

export function BorrowStatusPanel({
  status,
  token,
  totalBorrowed,
  borrowCap,
  reserveFactor,
  apy,
  chartProps,
  hasSparkAirdrop,
  capAutomatorInfo,
}: BorrowStatusPanelProps) {
  if (status === 'no') {
    return <EmptyStatusPanel status={status} variant="borrow" />
  }

  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} noRed />
        <Header status={status} variant="borrow" />
        <Subheader status={status} />
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

          <InfoTile>
            <InfoTile.Label>Reserve factor</InfoTile.Label>
            <InfoTile.Value>{formatPercentage(reserveFactor)}</InfoTile.Value>
          </InfoTile>

          {borrowCap && (
            <CapAutomatorInfoTile token={token} capAutomatorInfo={capAutomatorInfo} borrowCap={borrowCap} />
          )}
        </InfoTilesGrid>

        <div className="col-span-3 mt-6 sm:mt-10">
          <InterestYieldChart {...chartProps} />
        </div>
        {hasSparkAirdrop && <SparkAirdropInfoPanel variant="borrow" eligibleToken={token.symbol} />}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}

interface CapAutomatorInfoTileProps {
  token: Token
  capAutomatorInfo?: CapAutomatorConfig
  borrowCap: NormalizedUnitNumber
}

function CapAutomatorInfoTile({ token, capAutomatorInfo, borrowCap }: CapAutomatorInfoTileProps) {
  return (
    <div className={cn('grid grid-cols-subgrid gap-[inherit]', capAutomatorInfo && 'sm:col-span-2')}>
      {capAutomatorInfo && (
        <InfoTile>
          <InfoTile.Label>Borrow cap</InfoTile.Label>
          <InfoTile.Value data-testid={testIds.marketDetails.capAutomator.maxCap}>
            {token.format(capAutomatorInfo.maxCap, { style: 'compact' })} {token.symbol}
          </InfoTile.Value>
          <InfoTile.ComplementaryLine>
            {token.formatUSD(capAutomatorInfo.maxCap, { compact: true })}
          </InfoTile.ComplementaryLine>
        </InfoTile>
      )}

      <InfoTile>
        <InfoTile.Label>{capAutomatorInfo ? 'Instantly available borrow cap:' : 'Borrow cap'}</InfoTile.Label>
        <InfoTile.Value data-testid={testIds.marketDetails.capAutomator.cap}>
          {token.format(borrowCap, { style: 'compact' })} {token.symbol}
          {capAutomatorInfo && (
            <CooldownTimer
              renewalPeriod={capAutomatorInfo.increaseCooldown}
              latestUpdateTimestamp={capAutomatorInfo.lastIncreaseTimestamp}
            />
          )}
        </InfoTile.Value>
        <InfoTile.ComplementaryLine>{token.formatUSD(borrowCap, { compact: true })}</InfoTile.ComplementaryLine>
      </InfoTile>
    </div>
  )
}
