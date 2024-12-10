import { Button } from '@/ui/atoms/button/Button'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { AlertTriangle } from 'lucide-react'

export interface PageNotSupportedWarningProps {
  pageName: string
  openNetworkSelectDialog: () => void
}

export function PageNotSupportedWarning({ pageName, openNetworkSelectDialog }: PageNotSupportedWarningProps) {
  return (
    <div className="fixed inset-0 z-20">
      <div className="fixed inset-0 bg-alpha-overlay backdrop-blur-[2px]" aria-hidden="true" />

      <div
        className={cn(
          'absolute bottom-0 flex min-h-28 w-full flex-col items-center justify-center gap-4 lg:flex-row lg:gap-40',
          'bg-primary p-4 shadow-[0_0_128px_rgba(0,0,0,0.1)]',
        )}
      >
        <div className="flex gap-4">
          <AlertTriangle className="h-8 w-8 text-system-error-primary" />
          <div className="flex flex-col gap-0.5">
            <div className="typography-label-5 lg:typography-label-4 text-primary">
              {pageName} {pageName.endsWith('s') ? 'are' : 'is'} not supported on the network you are connected to.
            </div>
            <div className="typography-body-3 text-secondary">
              Switch to other supported networks to unlock this page.
            </div>
          </div>
        </div>
        <Button
          size="l"
          variant="secondary"
          className="w-full px-20 lg:w-fit"
          onClick={openNetworkSelectDialog}
          data-testid={testIds.component.SwitchNotSupportedNetworkButton}
        >
          Switch network
        </Button>
      </div>
    </div>
  )
}
