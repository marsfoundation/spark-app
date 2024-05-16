import { formatPercentage } from '@/domain/common/format'
import { SupplyAvailabilityStatus } from '@/domain/market-info/reserve-status'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'
import { ApyTooltip } from '@/ui/molecules/apy-tooltip/ApyTooltip'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { Typography } from '@/ui/atoms/typography/Typography'

import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { Link, LinkProps } from '@/ui/atoms/link/Link'
import { paths } from '@/config/paths'
import { links } from '@/ui/constants/links'


interface SupplyStatusPanelProps {
  status: SupplyAvailabilityStatus
  token: Token
  totalSupplied: NormalizedUnitNumber
  supplyCap?: NormalizedUnitNumber
  apy: Percentage
}

function DocsLink({ to, children, ...rest }: LinkProps) {
  return (
    <Link to={to} external className="text-slate-500 underline hover:text-slate-700" {...rest}>
      {children}
    </Link>
  )
}

function AirdropInfo() {
  const title = 'Eligible for 24M Spark Airdrop'
  const content = <>
    ETH depositors will be eligible for a future ⚡ SPK airdrop. Please read the details on the 
    {<DocsLink to={links.docs.sparkAirdrop}>Spark Docs</DocsLink>}.
  </>

  return (
    <Panel.Wrapper className={cn(
      'mt-6 py-4',
      'col-span-2 grid grid-cols-[auto_1fr] grid-rows-[auto_auto]',
      'bg-spark/10 border-none'
    )}>
      <Panel.Title variant="h4" className={cn('col-span-1 content-end')}>
          {title}
      </Panel.Title>
      <Panel.Content className={cn('row-start-1 row-span-2 content-center m-4')}>
        <img src={assets.sparkIcon} alt="Spark logo" style={{ height: '2.5rem' }} />
      </Panel.Content>
      <Panel.Content className={cn('col-span-1 content-start mt-2')}>
        <p className='text-xs text-slate-500'>
          {content}
        </p>
      </Panel.Content>
    </Panel.Wrapper>
  )
}

export function SupplyStatusPanel({ status, token, totalSupplied, supplyCap, apy }: SupplyStatusPanelProps) {
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
        <AirdropInfo />
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
