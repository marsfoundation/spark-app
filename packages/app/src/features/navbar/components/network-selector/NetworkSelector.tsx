import { getChainConfigEntry } from '@/config/chain'
import { Button } from '@/ui/atoms/button/Button'

import { SupportedChain } from '../../types'
import { NavbarActionWrapper } from '../NavbarActionWrapper'

export interface NetworkSelectorProps {
  currentChain: SupportedChain
  openSelectNetworkDialog: () => void
}

export function NetworkSelector({ currentChain, openSelectNetworkDialog }: NetworkSelectorProps) {
  const chainImage = getChainConfigEntry(currentChain.id).meta.logo

  return (
    <NavbarActionWrapper label="Network">
      <Button
        variant="secondary"
        size="md"
        className="h-auto w-full bg-white/10 px-3 lg:h-10 lg:w-fit"
        onClick={() => openSelectNetworkDialog()}
      >
        <div className="flex flex-row items-center gap-3">
          <img src={chainImage} className="h-7 w-7 lg:h-5 lg:w-5" />
          <div className="lg:hidden">{currentChain.name}</div>
        </div>
      </Button>
    </NavbarActionWrapper>
  )
}
