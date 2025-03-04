import { getChainConfigEntry } from '@/config/chain'
import { Path, getSupportedPages, pathGroups } from '@/config/paths'
import { useChainId, useChains } from 'wagmi'
import { Chain } from '../types'
import { useNetworkChange } from './useNetworkChange'

export interface UseSelectNetworkDialogParams {
  closeDialog: () => void
}

export interface UseSelectNetworkDialogResult {
  chains: Chain[]
}

export function useSelectNetworkDialog({ closeDialog }: UseSelectNetworkDialogParams): UseSelectNetworkDialogResult {
  const currentChainId = useChainId()
  const supportedChains = useChains()
  const { changeNetwork, isPending, variables } = useNetworkChange({
    onSuccess: () => {
      closeDialog()
    },
  })

  const chains: Chain[] = supportedChains.map((chain) => {
    const config = getChainConfigEntry(chain.id)

    return {
      name: config.meta.name,
      logo: config.meta.logo,
      supportedPages: formatSupportedPages(getSupportedPages(config)),
      selected: chain.id === currentChainId,
      isInSwitchingProcess: isPending && variables === chain.id,
      onSelect: () => {
        if (chain.id === currentChainId) {
          closeDialog()
          return
        }

        changeNetwork(chain.id)
      },
    }
  })

  return {
    chains,
  }
}

function formatSupportedPages(supportedPages: Path[]): string[] {
  const pageGroups = supportedPages.map(
    (path) => Object.entries(pathGroups).find(([, paths]) => paths.includes(path))?.[0],
  )
  const pageGroupNames = pageGroups.map((group) => group && pageGroupToName[group])
  const uniquePageGroupNames = pageGroupNames
    .filter((pageGroupName, index, self) => self.indexOf(pageGroupName) === index)
    .filter(Boolean) as string[]

  return uniquePageGroupNames
}

const pageGroupToName: Record<string, string> = {
  borrow: 'Borrow',
  savings: 'Savings',
  farms: 'Farms',
}
