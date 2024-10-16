import { getChainConfigEntry } from '@/config/chain'
import { Path, pathGroups } from '@/config/paths'
import { useChainId, useChains, useSwitchChain } from 'wagmi'
import { Chain } from '../types'

export interface UseSelectNetworkDialogParams {
  closeDialog: () => void
}

export interface UseSelectNetworkDialogResult {
  chains: Chain[]
}

export function useSelectNetworkDialog({ closeDialog }: UseSelectNetworkDialogParams): UseSelectNetworkDialogResult {
  const currentChainId = useChainId()
  const supportedChains = useChains()
  const { switchChain } = useSwitchChain({
    mutation: {
      onSuccess: () => closeDialog(),
    },
  })

  const chains: Chain[] = supportedChains.map((chain) => {
    const config = getChainConfigEntry(chain.id)

    return {
      name: config.meta.name,
      logo: config.meta.logo,
      supportedPages: formatSupportedPages(config.supportedPages),
      selected: chain.id === currentChainId,
      onSelect: () => {
        if (chain.id === currentChainId) {
          closeDialog()
          return
        }

        switchChain({
          chainId: chain.id,
        })
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
  const uniquePageGroupNames = pageGroupNames.filter(
    (pageGroupName, index, self) => self.indexOf(pageGroupName) === index,
  ) as string[]

  return uniquePageGroupNames
}

const pageGroupToName: Record<string, string> = {
  borrow: 'Borrow',
  savings: 'Savings',
  farms: 'Farms',
}
