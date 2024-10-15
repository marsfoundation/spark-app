import { cn } from '@/ui/utils/style'
import { AlertTriangle } from 'lucide-react'

export interface PageNotSupportedWarningProps {
  pageName: string
  className?: string
}

export function PageNotSupportedWarning({ pageName, className }: PageNotSupportedWarningProps) {
  return (
    <div
      className={cn(
        'sticky bottom-0 flex w-full items-center justify-center gap-2.5 bg-white p-4 shadow-[0_0_128px_rgba(0,0,0,0.1)]',
        className,
      )}
    >
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
