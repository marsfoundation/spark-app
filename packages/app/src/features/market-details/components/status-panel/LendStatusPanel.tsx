import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'

import { Header } from './components/Header'
import { InfoTile } from './components/info-tile/InfoTile'
import { InfoTilesGrid } from './components/info-tile/InfoTilesGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { TokenBadge } from './components/token-badge/TokenBadge'

interface LendStatusPanelProps {
  status: 'yes' // only for dai
  token: Token
  totalLent: NormalizedUnitNumber
  apy: Percentage
}

export function LendStatusPanel({ status, token, totalLent, apy }: LendStatusPanelProps) {
  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} />
        <Header status={status} variant="lend" />
        <TokenBadge symbol={token.symbol} />
        <InfoTilesGrid>
          <InfoTile>
            <InfoTile.Label>Total {token.symbol} lent</InfoTile.Label>
            <InfoTile.Value>
              {token.format(totalLent, { style: 'compact' })} {token.symbol}
            </InfoTile.Value>
            <InfoTile.ComplementaryLine>{token.formatUSD(totalLent, { compact: true })}</InfoTile.ComplementaryLine>
          </InfoTile>
          <InfoTile>
            <InfoTile.Label>Lend APY</InfoTile.Label>
            <InfoTile.Value>{formatPercentage(apy)}</InfoTile.Value>
          </InfoTile>
        </InfoTilesGrid>
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
