import { getChainConfigEntry } from '@/config/chain'
import { paths } from '@/config/paths'
import { useBlockedPages } from '@/features/compliance/logic/useBlockedPages'
import { matchPath, useLocation } from 'react-router-dom'
import { TopbarNavigationProps } from '../components/topbar-navigation/TopbarNavigation'
import { useSavingsInfo } from './useSavingsInfo'

interface UseNavigationInfoParams {
  chainId: number
}

export function useNavigationInfo({ chainId }: UseNavigationInfoParams): TopbarNavigationProps {
  const blockedPages = useBlockedPages()
  const savingsInfo = useSavingsInfo()
  const { daiSymbol, usdsSymbol } = getChainConfigEntry(chainId)

  const borrowSubLinks = [
    {
      to: paths.easyBorrow,
      label: `Borrow ${daiSymbol ?? ''}${usdsSymbol ? ` and ${usdsSymbol}` : ''}`,
    },
    {
      to: paths.myPortfolio,
      label: 'My portfolio',
    },
    {
      to: paths.markets,
      label: 'Markets',
    },
  ]

  const location = useLocation()
  const isBorrowSubLinkActive = borrowSubLinks.some((link) => matchPath(`${link.to}/*`, location.pathname))

  return {
    savingsInfo,
    blockedPages,
    borrowSubLinks,
    isBorrowSubLinkActive,
  }
}
