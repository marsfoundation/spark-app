import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
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
  const supportedPages = getChainConfigEntry(chainId).supportedPages

  const currentPage = Object.entries(paths).find(([_, path]) => matchPath(path, location.pathname))?.[0]
  const pageName = pageNamesMap[currentPage as keyof typeof paths]

  if (currentPage && supportedPages.includes(currentPage as keyof typeof paths)) {
    return { chainId, pageSupported: true, pageName }
  }

  return { chainId: mainnet.id, pageSupported: false, pageName }
}

const pageNamesMap: Record<keyof typeof paths, string> = {
  easyBorrow: 'Easy Borrow',
  myPortfolio: 'Portfolio',
  markets: 'Markets',
  marketDetails: 'Market',
  savings: 'Savings',
  farms: 'Farms',
  farmDetails: 'Farm',
}