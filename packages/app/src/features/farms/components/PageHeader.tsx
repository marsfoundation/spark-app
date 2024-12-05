import { NetworkBadge } from '@/ui/atoms/new/network-badge/NetworkBadge'

export interface PageHeaderProps {
  chainId: number
}

export function PageHeader({ chainId }: PageHeaderProps) {
  return (
    <div className="flex flex-row items-center gap-4">
      <h1 className="typography-heading-1">Farms</h1>
      <NetworkBadge chainId={chainId} />
    </div>
  )
}
