import { useWindowSize } from '@/ui/utils/useWindowSize'
import { useEffect } from 'react'
import { PageNotSupportedWarning } from './PageNotSupportedWarning'

export interface PageNotSupportedOverlayProps {
  navHeight: number
  pageName: string
}

export function PageNotSupportedOverlay({ navHeight, pageName }: PageNotSupportedOverlayProps) {
  const { height: windowHeight } = useWindowSize()

  useEffect(() => {
    const overflowStyle = (() => {
      if (navHeight >= windowHeight) {
        // allow to scroll non collapsed mobile navbar
        return 'auto'
      }

      return 'hidden'
    })()
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = overflowStyle

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [navHeight, windowHeight])

  return (
    <div
      className="absolute inset-0 z-[9999] flex flex-col justify-between bg-gray-100/30 backdrop-blur-[1.5px]"
      style={{
        top: navHeight,
      }}
      aria-hidden="true"
    >
      <div className="flex-grow" aria-hidden="true" />
      <PageNotSupportedWarning pageName={pageName} />
    </div>
  )
}
