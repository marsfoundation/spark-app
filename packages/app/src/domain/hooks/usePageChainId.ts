import { getChainConfigEntry } from '@/config/chain'
import { ChainConfigEntry } from '@/config/chain/types'
import { Path, pathGroups, paths } from '@/config/paths'
import { matchPath, useLocation } from 'react-router-dom'
import { mainnet } from 'viem/chains'
import { useChainId } from 'wagmi'

export interface UsePageChainIdResult {
  chainId: number
  pageSupported: boolean
  pageName: string
}

export function usePageChainId(): UsePageChainIdResult {
  const chainId = useChainId()
  const location = useLocation()
  const supportedPages = getSupportedPages(getChainConfigEntry(chainId))

  const currentPage = Object.entries(paths).find(([_, path]) => matchPath(path, location.pathname))?.[0]
  const pageName = pageNamesMap[currentPage as Path]

  if (currentPage && supportedPages.includes(currentPage)) {
    return { chainId, pageSupported: true, pageName }
  }

  return { chainId: mainnet.id, pageSupported: false, pageName }
}

const pageNamesMap: Record<Path, string> = {
  easyBorrow: 'Easy Borrow',
  myPortfolio: 'Portfolio',
  markets: 'Markets',
  marketDetails: 'Market',
  savings: 'Savings',
  farms: 'Farms',
  farmDetails: 'Farm',
}

function getSupportedPages(chainConfigEntry: ChainConfigEntry): Path[] {
  return [
    ...(chainConfigEntry.markets ? pathGroups.borrow : []),
    ...(chainConfigEntry.savings ? pathGroups.savings : []),
    ...(chainConfigEntry.farms ? pathGroups.farms : []),
  ]
}
