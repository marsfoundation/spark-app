import { SupplyAvailabilityStatus } from '@/domain/market-info/reserve-status'
import { Panel } from '@/ui/atoms/panel/Panel'

import { Header, Variant } from './Header'
import { StatusPanelGrid } from './StatusPanelGrid'
import { StatusIcon } from './status-icon/StatusIcon'

interface EmptyStatusPanelProps {
  status: SupplyAvailabilityStatus
  variant: Variant
}

export function EmptyStatusPanel({ status, variant }: EmptyStatusPanelProps) {
  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} noRed />
        <Header status={status} variant={variant} />
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
