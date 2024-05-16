import { formatPercentage } from '@/domain/common/format'
import { SupplyAvailabilityStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { DocsLink } from '@/ui/atoms/docs-link/DocsLink'
import { Panel } from '@/ui/atoms/panel/Panel'
import { links } from '@/ui/constants/links'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { getNativeTokenSymbolIfWrapped } from '@/utils/getDisplyTokenSymbol'

import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { SparkInfo } from './SparkInfo'

interface SupplyStatusPanelProps {
  status: SupplyAvailabilityStatus
  airdropEligible: boolean
  token: Token
  totalSupplied: NormalizedUnitNumber
  supplyCap?: NormalizedUnitNumber
  apy: Percentage
  chainId: number
}

export function SupplyStatusPanel({
  status,
  token,
  totalSupplied,
  supplyCap,
  apy,
  airdropEligible,
  chainId,
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
          {supplyCap && (
            <InfoTile>
              <InfoTile.Label>Supply cap</InfoTile.Label>
              <InfoTile.Value>
                {token.format(supplyCap, { style: 'compact' })} {token.symbol}
              </InfoTile.Value>
              <InfoTile.ComplementaryLine>{token.formatUSD(supplyCap, { compact: true })}</InfoTile.ComplementaryLine>
            </InfoTile>
          )}
        </InfoTilesGrid>
        {airdropEligible && (
          <SparkInfo
            title={<>Eligible for 24M Spark Airdrop</>}
            content={
              <>
                {getNativeTokenSymbolIfWrapped(chainId, token.symbol)} depositors will be eligible for a future ⚡ SPK
                airdrop. Please read the details <br />
                on the <DocsLink to={links.docs.sparkAirdrop}>Spark Docs</DocsLink>.
              </>
            }
          />
        )}
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
