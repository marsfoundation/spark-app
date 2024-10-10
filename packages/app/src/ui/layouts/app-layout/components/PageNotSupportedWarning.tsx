import { AlertTriangle } from 'lucide-react'

export interface PageNotSupportedWarningProps {
  pageName: string
}

export function PageNotSupportedWarning({ pageName }: PageNotSupportedWarningProps) {
  return (
    <div className="flex w-full items-center justify-center gap-2.5 bg-white p-4">
      <AlertTriangle className="h-8 w-8 text-[#FC4F37]" />
      <div className="flex flex-col gap-0.5">
        <div className="font-semibold text-primary text-sm lg:text-base">
          {pageName} {pageName.endsWith('s') ? 'are' : 'is'} not supported on the network you are connected to.
        </div>
        <div className="text-prompt-foreground text-xs lg:text-sm">
          Switch to other supported networks to unlock this page.
        </div>
      </div>
    </div>
  )
}
