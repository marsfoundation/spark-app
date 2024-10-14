import { PageNotSupportedWarning } from './PageNotSupportedWarning'

export interface PageNotSupportedOverlayProps {
  pageName: string
}

export function PageNotSupportedOverlay({ pageName }: PageNotSupportedOverlayProps) {
  return (
    <>
      <div className="fixed inset-0 z-10 bg-gray-100/30 backdrop-blur-[1.5px]" aria-hidden="true" />
      <PageNotSupportedWarning pageName={pageName} />
    </>
  )
}
