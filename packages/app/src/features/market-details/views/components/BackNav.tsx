import { ArrowLeft, Minus } from 'lucide-react'

import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
import { LinkButton } from '@/ui/atoms/button/Button'

interface BackNavProps {
  chainId: number
  chainName: string
}

export function BackNav({ chainId, chainName }: BackNavProps) {
  const chainImage = getChainConfigEntry(chainId).meta.logo

  return (
    <div className="flex items-center gap-1 px-3 sm:px-0">
      <LinkButton to={paths.markets} variant="text" size="sm" spaceAround="none" prefixIcon={<ArrowLeft size={16} />}>
        Back to Markets
      </LinkButton>
      <Minus className="rotate-90 text-white/20" />
      <div className="flex items-center gap-3">
        <img src={chainImage} className="h-5 w-5" />
        <span className="font-semibold text-xs leading-none tracking-wide">{chainName}</span>
      </div>
    </div>
  )
}
