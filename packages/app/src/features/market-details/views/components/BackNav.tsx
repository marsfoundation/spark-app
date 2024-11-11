import { ArrowLeftIcon, Minus } from 'lucide-react'

import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
import { ButtonIcon } from '@/ui/atoms/new/button/Button'
import { LinkButton } from '@/ui/atoms/new/link-button/LinkButton'

interface BackNavProps {
  chainId: number
  chainName: string
}

export function BackNav({ chainId, chainName }: BackNavProps) {
  const chainImage = getChainConfigEntry(chainId).meta.logo

  return (
    <div className="flex items-center gap-1 px-3 sm:px-0">
      <LinkButton to={paths.markets} variant="transparent" size="s">
        <ButtonIcon icon={ArrowLeftIcon} />
        Back to Markets
      </LinkButton>
      <Minus className="rotate-90 text-slate-700/10" />
      <div className="flex items-center gap-3">
        <img src={chainImage} className="h-5 w-5" />
        <span className="font-semibold text-sky-950 text-xs leading-none tracking-wide">{chainName}</span>
      </div>
    </div>
  )
}
