import { getChainConfigEntry } from '@/config/chain'
import { SupportedChain } from '@/features/topbar/types'
import { Button } from '@/ui/atoms/button/Button'

export interface TopbarNetworkProps {
  currentChain: SupportedChain
  onSelectNetwork: () => void
}

export function TopbarNetwork({ currentChain, onSelectNetwork }: TopbarNetworkProps) {
  const chainImage = getChainConfigEntry(currentChain.id).meta.logo

  return (
    <Button variant="tertiary" size="m" className="aspect-square p-2" onClick={onSelectNetwork}>
      <img src={chainImage} alt={`Chain ${currentChain.name} logo`} className="icon-md" />
    </Button>
  )
}
