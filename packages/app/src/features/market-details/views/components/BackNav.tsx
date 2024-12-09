import { paths } from '@/config/paths'
import { ButtonIcon } from '@/ui/atoms/button/Button'
import { LinkButton } from '@/ui/atoms/link-button/LinkButton'
import { NetworkBadge } from '@/ui/atoms/network-badge/NetworkBadge'
import { ArrowLeftIcon, MinusIcon } from 'lucide-react'

interface BackNavProps {
  chainId: number
}

export function BackNav({ chainId }: BackNavProps) {
  return (
    <div className="flex items-center gap-1 px-3 sm:px-0">
      <LinkButton to={paths.markets} variant="transparent" size="s">
        <ButtonIcon icon={ArrowLeftIcon} />
        Back to Markets
      </LinkButton>
      <MinusIcon className="rotate-90 text-neutral-200" />
      <NetworkBadge chainId={chainId} />
    </div>
  )
}
