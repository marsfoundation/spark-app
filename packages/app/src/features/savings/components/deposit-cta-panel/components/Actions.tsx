import { Button } from '@/ui/atoms/button/Button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { DepositCTAPanelProps } from '../DepositCTAPanel'

export interface ActionsProps {
  actions: DepositCTAPanelProps['actions']
  isInSandbox: boolean
  className?: string
}

export function Actions({ actions, isInSandbox, className }: ActionsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <Button variant="primary" size="l" onClick={actions.primary.action}>
        {actions.primary.title}
      </Button>
      <Tooltip open={isInSandbox ? undefined : false}>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="l" onClick={actions.secondary.action} disabled={isInSandbox}>
            {actions.secondary.title}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Already in Sandbox Mode</TooltipContent>
      </Tooltip>
    </div>
  )
}
