import { getChainConfigEntry } from '@/config/chain'

export interface NetworkBadgeProps {
  chainId: number
}

export function NetworkBadge({ chainId }: NetworkBadgeProps) {
  const { meta } = getChainConfigEntry(chainId)

  return (
    <div className="flex items-center gap-1 rounded-full bg-primary p-1 pr-2.5">
      <img src={meta.logo} className="icon-sm" alt={meta.name} />
      <span className="typography-label-4">{meta.name}</span>
    </div>
  )
}
