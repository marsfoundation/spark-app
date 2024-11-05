import { formatPercentage } from '@/domain/common/format'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { Panel } from '@/ui/atoms/panel/Panel'

import { InfoTile } from '@/ui/molecules/info-tile/InfoTile'
import { Header } from './components/Header'
import { InfoTilesGrid } from './components/InfoTilesGrid'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { StatusIcon } from './components/status-icon/StatusIcon'

interface LendStatusPanelProps {
  status: 'yes' // only for dai
  token: Token
  totalLent: NormalizedUnitNumber
  apy: Percentage | undefined
}

export function LendStatusPanel({ status, token, totalLent, apy }: LendStatusPanelProps) {
  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} noRed />
        <Header status={status} variant="lend" />
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
