import { SupplyAvailabilityStatus } from '@/domain/market-info/reserve-status'
import { Panel } from '@/ui/atoms/panel/Panel'

import { Header, Variant } from './Header'
import { StatusIcon } from './status-icon/StatusIcon'
import { StatusPanelGrid } from './StatusPanelGrid'

interface EmptyStatusPanelProps {
  status: SupplyAvailabilityStatus
  variant: Variant
}

export function EmptyStatusPanel({ status, variant }: EmptyStatusPanelProps) {
  return (
    <Panel.Wrapper>
      <StatusPanelGrid>
        <StatusIcon status={status} />
        <Header status={status} variant={variant} />
      </StatusPanelGrid>
    </Panel.Wrapper>
  )
}
