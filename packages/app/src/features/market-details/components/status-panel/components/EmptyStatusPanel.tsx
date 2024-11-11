import { SupplyAvailabilityStatus } from '@/domain/market-info/reserve-status'
import { Header, Variant } from './Header'
import { StatusPanelGrid } from './StatusPanelGrid'
import { StatusIcon } from './status-icon/StatusIcon'

interface EmptyStatusPanelProps {
  status: SupplyAvailabilityStatus
  variant: Variant
}

export function EmptyStatusPanel({ status, variant }: EmptyStatusPanelProps) {
  return (
    <StatusPanelGrid>
      <StatusIcon status={status} />
      <Header status={status} variant={variant} />
    </StatusPanelGrid>
  )
}
