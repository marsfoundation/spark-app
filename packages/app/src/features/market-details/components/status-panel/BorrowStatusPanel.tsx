import { formatPercentage } from '@/domain/common/format'
import { BorrowEligibilityStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { DocsLink } from '@/ui/atoms/docs-link/DocsLink'

import { InterestYieldChart, InterestYieldChartProps } from '../charts/interest-yield/InterestYieldChart'
import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { TokenBadge } from './components/token-badge/TokenBadge'
import { SparkInfo } from './SparkInfo'
import { links } from '@/ui/constants/links'
import { getNativeTokenSymbolIfWrapped } from '@/utils/getDisplyTokenSymbol'

interface BorrowStatusPanelProps {
  status: BorrowEligibilityStatus
  airdropEligible: boolean
  token: Token
  totalBorrowed: NormalizedUnitNumber
  borrowCap?: NormalizedUnitNumber
  reserveFactor: Percentage
  apy: Percentage
  chartProps: InterestYieldChartProps
  chainId: number
  showTokenBadge?: boolean
}

export function BorrowStatusPanel({
  status,
  token,
  totalBorrowed,
  borrowCap,
  reserveFactor,
  apy,
  chartProps,
  chainId,
  airdropEligible,
  showTokenBadge = false,
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
          {borrowCap && (
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
        <div className="col-span-3 mt-6 sm:mt-10">
          <InterestYieldChart {...chartProps} />
        </div>
        {airdropEligible && 
          <SparkInfo 
            title={<>Eligible for 24M Spark Airdrop</>}
            content={<>
              {getNativeTokenSymbolIfWrapped(chainId, token.symbol)}
              {" "}
              borrowers will be eligible for a future ⚡ SPK airdrop. Please read the details <br />on the
              {" "}
              {<DocsLink to={links.docs.sparkAirdrop}>Spark Docs</DocsLink>}.
            </>}
          />}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
