import { getChainConfigEntry } from '@/config/chain'
import { SupportedChain } from '@/features/navbar/types'
import { IconButton } from '@/ui/atoms/new/icon-button/IconButton'

export interface TopbarNetworkProps {
  currentChain: SupportedChain
  onSelectNetwork: () => void
}

export function TopbarNetwork({ currentChain, onSelectNetwork }: TopbarNetworkProps) {
  const chainImage = getChainConfigEntry(currentChain.id).meta.logo

  return (
    <IconButton variant="tertiary" size="m" className="p-2" onClick={onSelectNetwork}>
      <img src={chainImage} alt={`Chain ${currentChain.name} logo`} className="icon-md" />
    </IconButton>
  )
}
