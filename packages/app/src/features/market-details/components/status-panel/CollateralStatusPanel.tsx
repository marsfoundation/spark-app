import { formatPercentage } from '@/domain/common/format'
import { DebtCeilingProgress } from '@/features/market-details/components/debt-ceiling-progress/DebtCeilingProgress'
import { InfoTile } from '@/features/market-details/components/info-tile/InfoTile'
import { CollateralStatusInfo } from '../../types'
import { EmptyStatusPanel } from './components/EmptyStatusPanel'
import { Header } from './components/Header'
import { InfoTilesGrid } from './components/InfoTilesGrid'
import { StatusPanelGrid } from './components/StatusPanelGrid'
import { Subheader } from './components/Subheader'
import { StatusIcon } from './components/status-icon/StatusIcon'

export function CollateralStatusPanel(props: CollateralStatusInfo) {
  const { status, maxLtv, liquidationThreshold, liquidationPenalty } = props

  if (status === 'no' && liquidationThreshold.isZero()) {
    return <EmptyStatusPanel status={status} variant="collateral" />
  }

  return (
    <StatusPanelGrid>
      <StatusIcon status={status} />
      <Header status={status} variant="collateral" />
      <Subheader status={status} />
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
  )
}
