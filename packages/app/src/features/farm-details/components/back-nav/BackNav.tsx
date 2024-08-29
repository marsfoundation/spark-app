import { ArrowLeft, Minus } from 'lucide-react'

import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
import { LinkButton } from '@/ui/atoms/button/Button'

interface BackNavProps {
  chainId: number
}

export function BackNav({ chainId }: BackNavProps) {
  const chainConfig = getChainConfigEntry(chainId)
  const chainImage = chainConfig.meta.logo
  const chainName = chainConfig.meta.name

  return (
    <div className="flex items-center gap-1 px-3 sm:px-0">
      <LinkButton to={paths.farms} variant="text" size="sm" spaceAround="none" prefixIcon={<ArrowLeft size={16} />}>
        Back to Farms
      </LinkButton>
      <Minus className="rotate-90 text-slate-700/10" />
      <div className="flex items-center gap-3">
        <img src={chainImage} className="h-5 w-5" />
        <span className="font-semibold text-sky-950 text-xs leading-none tracking-wide">{chainName}</span>
      </div>
    </div>
  )
}
