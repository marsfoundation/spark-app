import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'

import { getChainConfigEntry } from '@/config/chain'
import { Button } from '@/ui/atoms/button/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown/DropdownMenu'

import { SupportedChain } from '../../types'
import { NavbarActionWrapper } from '../NavbarActionWrapper'

export interface NetworkSelectorProps {
  currentChain: SupportedChain
  supportedChains: SupportedChain[]
  onNetworkChange: (chainId: number) => void
}

export function NetworkSelector({ currentChain, supportedChains, onNetworkChange }: NetworkSelectorProps) {
  const [open, setOpen] = useState(false)
  const chainImage = getChainConfigEntry(currentChain.id).meta.logo

  return (
    <NavbarActionWrapper label="Network">
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="md" className="h-auto px-2 lg:h-10" postfixIcon={<Chevron open={open} />}>
            <div className="flex flex-row items-center gap-3">
              <img src={chainImage} className="h-7 w-7 lg:h-5 lg:w-5" />
              <div className="lg:hidden">{currentChain.name}</div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {supportedChains.map((chain) => (
            <React.Fragment key={chain.id}>
              <DropdownMenuItem
                className="w-[calc(100vw-48px)] cursor-pointer lg:w-auto"
                onClick={() => onNetworkChange(chain.id)}
              >
                <div className="flex items-center gap-2">
                  <img src={getChainConfigEntry(chain.id).meta.logo} className="h-5 w-5" />
                  <span className="text-basics-black font-semibold lg:text-xs">{chain.name}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="last:hidden" />
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </NavbarActionWrapper>
  )
}

function Chevron({ open }: { open: boolean }) {
  if (open) {
    return <ChevronUp size={16} className="text-basics-dark-grey ml-auto" />
  }
  return <ChevronDown size={16} className="text-basics-dark-grey ml-auto" />
}
