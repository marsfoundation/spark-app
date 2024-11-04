import { getChainConfigEntry } from '@/config/chain'
import { SupportedChain } from '@/features/navbar/types'
import { Button } from '@/ui/atoms/new/button/Button'

export interface TopbarNetworkProps {
  currentChain: SupportedChain
  onSelectNetwork: () => void
}

export function TopbarNetwork({ currentChain, onSelectNetwork }: TopbarNetworkProps) {
  const chainImage = getChainConfigEntry(currentChain.id).meta.logo

  return (
    <Button variant="tertiary" size="m" className="p-2 aspect-square" onClick={onSelectNetwork}>
      <img src={chainImage} alt={`Chain ${currentChain.name} logo`} className="icon-md" />
    </Button>
  )
}
