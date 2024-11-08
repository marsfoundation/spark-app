import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
import { ButtonIcon } from '@/ui/atoms/new/button/Button'
import { LinkButton } from '@/ui/atoms/new/link-button/LinkButton'
import { ArrowLeftIcon, Minus } from 'lucide-react'

interface BackNavProps {
  chainId: number
}

export function BackNav({ chainId }: BackNavProps) {
  const chainConfig = getChainConfigEntry(chainId)
  const chainImage = chainConfig.meta.logo
  const chainName = chainConfig.meta.name

  return (
    <div className="flex items-center gap-1 px-3 sm:px-0">
      <LinkButton to={paths.farms} variant="transparent" size="s">
        <ButtonIcon icon={ArrowLeftIcon} />
        Back to Farms
      </LinkButton>
      <Minus className="rotate-90 text-primary/10" />
      <div className="flex items-center gap-2">
        <img src={chainImage} className="icon-sm" />
        {/* todo add badge */}
        <span className="typography-label-6 leading-none tracking-wide">{chainName}</span>
      </div>
    </div>
  )
}
