import { Opaque } from '@/domain/types/types'
import { useCallback, useState } from 'react'

export type PortalRef = Opaque<
  {
    current: HTMLElement | null
  },
  'PortalRef'
>
export function PortalRef(value: { current: HTMLElement | null }): PortalRef {
  return value as PortalRef
}

export interface UsePortalRefResult {
  portalRef: PortalRef | undefined
  refCallback: (node: HTMLElement | null) => void
}

// this hooks helps to avoid ref timing issues when using portals (for example, when using Dialogs)
export function usePortalRef(): UsePortalRefResult {
  const [portalRef, setPortalRef] = useState<PortalRef | undefined>(undefined)

  const refCallback = useCallback((node: HTMLElement | null) => {
    setPortalRef(PortalRef({ current: node }))
  }, [])

  return { portalRef, refCallback }
}
