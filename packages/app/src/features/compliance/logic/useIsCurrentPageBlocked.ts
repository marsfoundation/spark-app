import { matchPath, useLocation } from 'react-router-dom'

import { paths } from '@/config/paths'

import { useBlockedPages } from './useBlockedPages'

export function useIsCurrentPageBlocked(): boolean {
  const blockedPages = useBlockedPages()
  const { pathname } = useLocation()

  for (const blockedPage of blockedPages) {
    if (matchPath(paths[blockedPage], pathname)) {
      return true
    }
  }

  return false
}
