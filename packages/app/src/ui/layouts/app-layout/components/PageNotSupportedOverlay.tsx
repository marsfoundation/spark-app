import { PageNotSupportedWarning } from './PageNotSupportedWarning'

export interface PageNotSupportedOverlayProps {
  pageName: string
}

export function PageNotSupportedOverlay({ pageName }: PageNotSupportedOverlayProps) {
  return (
    <div
      className="fixed z-40 flex h-full w-full flex-col justify-end bg-gray-100/30 backdrop-blur-[1.5px]"
      aria-hidden="true"
    >
      <PageNotSupportedWarning pageName={pageName} />
    </div>
  )
}
