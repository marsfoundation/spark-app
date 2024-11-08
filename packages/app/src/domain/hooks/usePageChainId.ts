import { getChainConfigEntry } from '@/config/chain'
import { lastSepolia } from '@/config/chain/constants'
import { Path, getSupportedPages, paths } from '@/config/paths'
import { matchPath, useLocation } from 'react-router-dom'
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

  if (!currentPage) {
    // @note When the current page is not found in the paths that means the page is
    // not existent *but* supported so we can display 404 page
    return { chainId, pageSupported: true, pageName: '' }
  }

  if (supportedPages.includes(currentPage)) {
    return { chainId, pageSupported: true, pageName }
  }

  return { chainId: lastSepolia.id, pageSupported: false, pageName }
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
